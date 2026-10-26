"""Private parser. Scanning failure never falls through to extraction."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import hashlib,json,os,re,subprocess,tempfile,time,threading
from pypdf import PdfReader
SCAN_LOCK=threading.Lock()
LIMIT=25*1024*1024

def scan_pdf(path):
    with SCAN_LOCK:
        signatures=list(Path('/var/lib/clamav').glob('*.c[lv]d'))
        if not signatures or time.time()-max(p.stat().st_mtime for p in signatures)>72*3600:
            update=subprocess.run(['freshclam','--datadir=/var/lib/clamav','--stdout'],capture_output=True,timeout=180)
            if update.returncode: return {'scanStatus':'scan_failed','error':'Malware signatures could not be refreshed.'}
        scan=subprocess.run(['clamscan','--no-summary','--max-filesize=26M','--max-scansize=100M',str(path)],capture_output=True,timeout=180)
        if scan.returncode==1:return {'scanStatus':'infected','error':'The document did not pass malware scanning.'}
        if scan.returncode!=0:return {'scanStatus':'scan_failed','error':'Malware scanning could not complete.'}
    return {'scanStatus':'clean'}

def extract_pdf(path,work):
    reader=PdfReader(path)
    if reader.is_encrypted:raise ValueError('Encrypted PDFs are not supported.')
    if len(reader.pages)>200:raise ValueError('The processing limit is 200 pages. Submit a shorter author manuscript.')
    root=reader.trailer['/Root']
    if any(key in root for key in ['/OpenAction','/AA','/AcroForm']) or '/JavaScript' in root.get('/Names',{}):raise ValueError('Active PDF content is not supported.')
    if '/EmbeddedFiles' in root.get('/Names',{}):raise ValueError('Embedded files are not supported.')
    pages=[]
    for number,page in enumerate(reader.pages,1):
        if '/AA' in page:raise ValueError('Active PDF page actions are not supported.')
        text=page.extract_text() or ''
        if len(text.strip())<30:
            prefix=work/f'page-{number}'
            subprocess.run(['pdftoppm','-f',str(number),'-l',str(number),'-scale-to','2000','-png','-singlefile',str(path),str(prefix)],check=True,capture_output=True,timeout=45)
            result=subprocess.run(['tesseract',str(prefix)+'.png','stdout'],check=True,capture_output=True,text=True,timeout=60)
            text=result.stdout
        pages.append({'page':number,'text':text})
        if len(json.dumps(pages).encode())>800000:raise ValueError('Extracted text exceeds the private processing limit.')
    if not any(p['text'].strip() for p in pages):raise ValueError('No readable text was found.')
    return pages

class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_POST(self):
        if self.path!='/extract':self.send_error(404);return
        try:
            size=int(self.headers.get('Content-Length','0'))
            # Worker supplies a bounded PDF; reject missing lengths instead of
            # buffering an unbounded stream in the parser.
            if not 0<size<=LIMIT:raise ValueError('PDF must be non-empty and at most 25 MB.')
            data=self.rfile.read(size)
            if len(data)!=size or not data.startswith(b'%PDF-'):raise ValueError('Invalid PDF data.')
            actual=hashlib.sha256(data).hexdigest()
            if actual!=self.headers.get('x-document-sha256'):raise ValueError('Document fingerprint mismatch.')
            with tempfile.TemporaryDirectory() as directory:
                work=Path(directory);path=work/'paper.pdf';path.write_bytes(data)
                result=scan_pdf(path)
                if result['scanStatus']=='clean':
                    try: result.update(pages=extract_pdf(path,work),parserVersion='pypdf-6.10.0/poppler/tesseract',hash=actual)
                    except Exception as error:result={'scanStatus':'rejected','error':str(error)[:600]}
        except Exception as error:result={'scanStatus':'scan_failed','error':str(error)[:600]}
        body=json.dumps(result).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
if __name__=='__main__':ThreadingHTTPServer(('0.0.0.0',8080),Handler).serve_forever()
