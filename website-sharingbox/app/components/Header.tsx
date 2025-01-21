export default function Header() {
  const openedBoxId = getCookie("opened_box_id");
  const userId = getCookie("user_id");

  function getCookie(name: string) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  return (
    <header className="w-full bg-mint-green text-dark-green shadow-lg">
      <div className="container mx-auto px-10 py-3">
        <h1 className="text-5xl font-extrabold text-center">
          Your Smart Giveaway Box
        </h1>
      </div>
      {openedBoxId && userId ? (
        <div className="top-0 left-0 w-full bg-dark-green text-white text-center py-2 font-bold z-50">
          The box is open - please close it after you are done.
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}
