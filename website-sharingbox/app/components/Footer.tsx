export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center flex justify-center">
          <p>Smart Giveaway Box.</p>
          <a className="mx-3" href="/boxes">
            <u>Locations</u>
          </a>
          <a className="mr-3" href="/support">
            <u>Support</u>
          </a>
          <a href="/about_us_and_faq">
            <u>About Us</u>
          </a>
        </div>
      </footer>
    );
}