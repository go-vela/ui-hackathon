import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";

type QueryObject = {
  code?: string;
  state?: string;
};

export function AccountAuthenticate() {
  const url = new URL(window.location.href);
  const params1 = new URLSearchParams(url.search);
  const queryObject: QueryObject = Object.fromEntries(params1.entries());
  const { code, state } = queryObject;
  const apiUrl = new URL(
    import.meta.env.VITE_VELA_API
      ? `${import.meta.env.VITE_VELA_API}/authenticate`
      : "http://localhost:8080/authenticate"
  );

  for (const e of params1.entries()) {
    apiUrl.searchParams.set(...e);
  }

  const q = useQuery({
    queryKey: [code, state],
    queryFn: async () => {
      // AuthenticateService.getAuthenticateTypeWeb(code, state).then()
      return fetch(apiUrl.href).then((resp) => resp.json());
    },
  });

  if (q?.data?.token) {
    window.localStorage.setItem("vela-access-token", q.data.token);

    // 💁‍♂️ we redirect back to / after setting this session storage
    // so that react / our app remounts
    // which should cause the OpenAPI code in the main also re-run
    // now with visibility into the session storage
    // this isn't robust but it's good enough to test with
    setTimeout(() => {
      window.location.href = "/";
    }, 10);
  }

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <Loader />
      </div>
    </>
  );
}
