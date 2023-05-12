import React from 'react'

const Message = ({color, text, messages, setMessages, index}) => {

    const handleClick = () => {
        const copy = [...messages]
        copy.splice(index, 1)
        setMessages(copy)
    }

    return (
        // grab alert from bootstrap
        <div className={`alert alert-${color} alert-dismissible fade show`}>
            {text}
            <button type="button" className="btn-close" onClick={handleClick}/>
        </div>

    )

} 
export default Message;