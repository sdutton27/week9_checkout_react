import React, { useState, useEffect } from 'react';
import Home from './views/Home';
import Navbar from './components/Navbar';
import News from './views/News';
import { Routes, Route } from 'react-router-dom';
import Feed from './views/Feed';
import Login from './views/Login';
import SignUp from './views/SignUp';
import NewsFunction from './views/NewsFunction';
import SinglePost from './views/SinglePost';
import CreatePost from './views/CreatePost';
import UpdatePost from './views/UpdatePost';
import Shop from './views/Shop';
import Cart from './views/Cart';
import Message from './components/Message';

const getUserFromLocalStorage = () => {
  const found = localStorage.getItem('user115')
  if ( found ) {
    return JSON.parse(found)
  }
  return {}
}

export default function App() {
  const [user, setUser] = useState(getUserFromLocalStorage)
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])

  const getTotal = (cart) => {
    let total = 0
    for (let item of cart) {
      total += parseFloat(item.price)
    }
    return total.toFixed(2)
  }
  
  const addToCart = (item) => {
    setCart([...cart, item])
  };

  const removeFromCart = (item) => {
    const copy = [...cart]
    for (let i = cart.length-1; i>=0; i--){
      if (item.id === cart[i].id){
        copy.splice(i, 1);
        break
      }
    }
    setCart(copy)
  };

  useEffect(()=>{
    getCart()
  }, [user])

  const getCart = async () => {
    if (user.apitoken){
      const res = await fetch('http://127.0.0.1:5000/api/cart', {
      headers: {Authorization: `Bearer ${user.apitoken}`}
      });
      const data = await res.json();
      if (data.status === 'ok'){
        setCart(data.cart)
      }
    }
    
    else{
      setCart([])
    }
  }

  const logMeIn = (user, rememberMe) => {
    // this.setState({user: user})
    setUser(user)
    if (rememberMe) {
      localStorage.setItem('user115', JSON.stringify(user))
    }
  };
  const logMeOut = () => {
    // this.setState({user:{}})
    setUser({})
    localStorage.removeItem('user115')
  };
  
  const showMessages = () => {
    return messages.map(({text, color}, index) => {return <Message key={index} text={text} color={color} messages={messages} setMessages={setMessages} index={index} />})
  }

  useEffect(()=>{
    const query = new URLSearchParams(window.location.search);

    const copy = [...messages]

    if (query.get('success')) {
        copy.push({
            text: "You have successfully checked out.",
            color: "success"
        })
        setMessages(copy)
    }
    if (query.get('canceled')) {
        copy.push({
            text: "Order canceled. Please continue to shop and then try checking out again.",
            color: "warning"
        })
        setMessages(copy)
      }
  },[])




  return (
    <div>
      <Navbar user={user} logMeOut={logMeOut} cart={cart} getTotal={getTotal}/>
      {/* <h1>Hello World</h1> */}
      {showMessages()}
      <Routes>
        <Route path='/' element={<Home user={user} age='9000' />} />
        <Route path='/news' element={<News user={user} />} />
        <Route path='/news2' element={<NewsFunction user={user} />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login logMeIn={logMeIn} user={user}/>} />
        <Route path='/signup' element={<SignUp />} />
        
        <Route path='/posts/:postId' element={<SinglePost user={user}/>} />

        <Route path='/posts/create' element={<CreatePost user={user}/>} />
        <Route path='/posts/update/:postId' element={<UpdatePost user={user}/>} />

        <Route path='/shop' element={<Shop user={user} addToCart={addToCart}/>} />
        <Route path='/cart' element={<Cart user={user} removeFromCart={removeFromCart} cart={cart}/>} />
      </Routes>
    </div>
  )

}
