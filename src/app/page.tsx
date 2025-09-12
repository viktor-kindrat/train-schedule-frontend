export default function Home() {
  return (
    <div className="flex-column-center h-screen w-full gap-4">
      <div className="from-primary-200 absolute top-0 left-0 h-[450px] w-[450px] bg-radial to-neutral-100 opacity-60 blur-2xl" />
      <h1 className="headline-1">Hello world!</h1>
      <p className="body-16-regular">
        Welcome to my new Next.js app. Here will be platform which allows to see{' '}
        <b className="body-14-semibold">train schedule</b>.
      </p>
      <div className="from-accent-200 absolute right-0 bottom-0 h-[450px] w-[450px] bg-radial to-neutral-100 opacity-60 blur-2xl" />
    </div>
  );
}
