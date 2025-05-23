

export default function HomePage() {
    return (
      <div className="min-h-screen bg-white-100 flex flex-col">
        <header className="bg-orange-500 p-4 flex items-center justify-between h-22a">
          <img />
          <div className="space-x-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Cadastre-se</button>
          </div>
        </header>
  
        <div className="flex flex-1 pl-20 pr-80">

          <aside className="w-64 p-14">
            <h2 className="text-sm font-bold mb-4">FUTEBOL</h2>
            <ul className="space-y-4">
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Premier League</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">La Liga</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Serie A</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Ligue 1</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Bundesliga</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Brasileirão</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Libertadores</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Sulamericana</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Liga dos campeões</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Liga Conferência</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Liga Europa</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Copa do Brasil</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Eurocopa</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Copa do Mundo</li>
              <li className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Copa America</li>
            </ul>
          </aside>
  
          {/* conteúdo principal */}
          <main className="flex-1 bg-white mt-10 ml-10 mr-24 rounded-xl shadow-lg border">

          </main>
        </div>
      </div>
    );
  }
  