import { useEffect } from "react";
import { useRouter } from "next/router";

const Ametrica = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/ametrica/meter");
    }, 3000);
  }, []);

  return (
    <div>
      <h1>just an Ametrica</h1>
    </div>
  );
};

export default Ametrica;
