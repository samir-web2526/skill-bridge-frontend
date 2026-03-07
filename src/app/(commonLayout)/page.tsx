import { getSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getSession();
  console.log(session);

  return (
    <div>
      {session ? <p>Welcome {session.user.name}</p> : <p>Not logged in</p>}
    </div>
  );
}
