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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-between w-[80%] h-[65%] bg-white rounded-lg"
        >
          <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default">
            Sign up
          </div>
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="text"
            name="name"
            placeholder="Name"
          />
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="email"
            placeholder="Email"
            name="email"
          />
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Password"
            name="password"
          />
          <input
            className="flex h-16 px-4 items-center gap-[5px] text-[24px]/[32px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Confirm Password"
          />
          <p className="text-[#626262] self-start font-berlin-sans text-[24px] font-normal underline decoration-solid [text-decoration-skip-ink:none]">
            Forgot Password
          </p>
          <button className="w-full bg-[#2C3694] text-white h-12" type="submit">
            Sign up
          </button>
          <div className="text-[#626262]">
            Have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
