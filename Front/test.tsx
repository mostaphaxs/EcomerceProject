export default function TestMasterCSS() {
  return (
    <div>
         
    <div className="p-100 m-6 bg-gradient-to-br from-purple-900 via-black to-blue-900 rounded-2xl relative overflow-hidden group">
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Nebula */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      
      <h1 className="text-3xl font-black text-white mb-4 relative z-10">
        ShopMe Galaxy
      </h1>
      <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl relative z-10">
        Launch Explorer
      </button>
      <p className="text-white/60 mt-4 font-light relative z-10">
        Universal shopping experience
      </p>
    </div>







    


  


    </div>
  );
}