import Banner from "@/components/modules/home/Banner";
import { getSession } from "@/services/user.service";

export default async function Home() {
  const {data}= await getSession();
  console.log(data);
  return (
   <div className="mx-auto px-16">
     <Banner></Banner>
   </div>
  );
}
