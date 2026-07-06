import MainPage from "./MainPage"

function App() {

  return ( 
    <div>
      <div className="w-full shadow-xl text-center my-2 p-1">
        <h1 className="text-xl md:text-2xl text-[#2B54A1] font-bold">Text Summarizer</h1>
        <h3 className="text-[#0E7488] p-3 text-sm md:text-base">Paste or write your text and get an AI-generated summary</h3>
      </div>

      <div className="p-4">
        <MainPage />
      </div>
    </div>
  )
}

export default App
