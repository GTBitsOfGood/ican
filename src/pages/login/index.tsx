import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    alert(JSON.stringify(data));
  };
  return (
    <div className="h-screen font-quantico bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-10">
      <div className="flex flex-col items-center justify-center rounded-[64px] w-2/5 bg-white h-full mx-auto">
        <Image
          className="mb-4"
          src="/icanLogo.svg"
          alt="Logo"
          width={248}
          height={167}
        />
        <div className="self-center w-[80%] my-4 text-left text-black text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
          Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-between w-[80%] h-[45%] bg-white rounded-lg"
        >
          <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default">
            Log in
          </div>
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="text"
            placeholder="Email"
          />
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Password"
          />
          <p className="text-[#626262] self-start font-berlin-sans text-[24px] font-normal underline decoration-solid [text-decoration-skip-ink:none]">
            Forgot Password
          </p>
          <button className="w-full bg-[#ACCC6E] text-black h-12" type="submit">
            Login
          </button>
        </form>
        <div className="text-[#626262]">
          Don&apos;t have an account?{" "}
          <Link className="underline" href="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
