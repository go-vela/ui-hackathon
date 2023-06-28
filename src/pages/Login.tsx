import { TopBumper } from "../components/TopBumper";

export function Login() {
  return (
    <>
      <TopBumper />
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Authenticate via</h1>
        <div>
          <a
            className="btn-primary mb-4"
            href={`${import.meta.env.VITE_VELA_API}/login?type=web`}
            data-test="login-button"
          >
            <div className="flex items-center gap-2">
              <svg
                className="login-source-icon"
                fill="none"
                height="20"
                width="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
