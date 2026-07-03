import { useState } from "react";

function MainPage() {

    //Hooks
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);

    //Handles the submit and sends to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Checks for a empty field
        if (text === ""){
            setResult("Please enter some text.")
        }

        const response = await fetch("http://localhost:5001/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
            })
        });

        const data = await response.json();

        if(!response.ok) {
            setResult(data.message);
            return;
        }

        setResult(data.summary);
    }

    //Resets the textboxes
    const handleReset = () => {
        setText("");
        setResult("");
    }

    return (
      <div>

        <h1>Text Summarizer</h1>
        <h3>Paste your text and wait for the AI to summarize it</h3>
        
        <div>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={10}
                        cols={50}
                        placeholder="Paste text here: "
                    />
                </div>

                <div>
                    <button type="reset">Clear</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>


        <div>

        </div>


      </div>  
    )
}

export default MainPage;