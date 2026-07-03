import MainPage from "./MainPage"

function App() {

  return ( 
    <div>
      <div className="w-full shadow-md text-center my-2 p-1">
        <h1 className="text-2xl text-[#EA7763] font-bold">Text Summarizer</h1>
        <h3 className="text-[#0E7488]">Paste or write your text and get an AI-generated summary</h3>
      </div>

      <MainPage />
    </div>
  )
}

export default App
