export function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="mb-6">Questions? Call 1-800-123-4567</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <p className="hover:underline cursor-pointer">FAQ</p>
            <p className="hover:underline cursor-pointer">Investor Relations</p>
            <p className="hover:underline cursor-pointer">Privacy</p>
            <p className="hover:underline cursor-pointer">Speed Test</p>
          </div>

          <div className="space-y-2">
            <p className="hover:underline cursor-pointer">Help Center</p>
            <p className="hover:underline cursor-pointer">Jobs</p>
            <p className="hover:underline cursor-pointer">Cookie Preferences</p>
            <p className="hover:underline cursor-pointer">Legal Notices</p>
          </div>

          <div className="space-y-2">
            <p className="hover:underline cursor-pointer">Account</p>
            <p className="hover:underline cursor-pointer">Ways to Watch</p>
            <p className="hover:underline cursor-pointer">Corporate Information</p>
            <p className="hover:underline cursor-pointer">Only on Net-Free</p>
          </div>

          <div className="space-y-2">
            <p className="hover:underline cursor-pointer">Media Center</p>
            <p className="hover:underline cursor-pointer">Terms of Use</p>
            <p className="hover:underline cursor-pointer">Contact Us</p>
          </div>
        </div>

        <p className="text-sm">Net-Free</p>
      </div>
    </footer>
  )
}
