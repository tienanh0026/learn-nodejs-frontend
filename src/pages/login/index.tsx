import { login } from "@modules/api/login";
import { useId, useState } from "react";

export default function LoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const mailId = useId();
  const passwordId = useId();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(mail, password);
          login({ email: mail, password: password });
        }}
      >
        <label htmlFor={mailId}>
          <p>Email</p>
          <input
            id={mailId}
            name='email'
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />
        </label>
        <label htmlFor={passwordId}>
          <p>Password</p>
          <input
            id={passwordId}
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}
