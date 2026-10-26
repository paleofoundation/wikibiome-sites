import { corpusForIntake } from "@/lib/paper-intake";
import { bridgeAuthorized } from "@/lib/paper-intake-bridge";
export async function GET(request: Request) {
  if (!(await bridgeAuthorized(request)))
    return Response.json(
      { error: "Service authorization required." },
      { status: 401 },
    );
  return Response.json({ pages: corpusForIntake() });
}
