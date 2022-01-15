import React from 'react'
import { useState } from 'react'
import "./TabPanel.css"

function TabPanel({elements}) {
    const [selection, setSelection] = useState(elements[0].id)
    return (
        <div className='tabpanel'>

            <div className="tab">
                { elements.map(element=>(
                    <input 
                        key={element.label} 
                        type="button" 
                        name={element.id} 
                        value={element.label} 
                        title={element.title}
                        onClick={(e)=>setSelection(e.target.name)}
                        className={element.id === selection ? 'active' : '' }
                    />))
                }
            </div>

            {elements.map(element=> (  
                selection === element.id ?
                <div key={element.id} className="tabcontent">
                    {element.render()}
                </div>
                :
                null
            ))}
            
        </div>
    )
}

export default TabPanel
