export const LoginForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full px-3.5 py-2.5 rounded-md border border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          className="w-full px-3.5 py-2.5 rounded-md border border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      
      <button 
        type="button" 
        className="mt-4 p-3 rounded-md border-none bg-gray-900 text-white font-medium cursor-pointer hover:bg-gray-800 transition-colors"
      >
        Sign in
      </button>
    </form>
  );
};
