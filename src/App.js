

import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Header from './Header'
import Body from './Body'
import Cookies from 'js-cookie';



function App() {
    const [showSidebar, setSidebar] = useState(true);
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(null);

  
  
      
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {setUser(codeResponse); Cookies.set('access_token', codeResponse.access_token)},
        onError: (error) => console.log('Login Failed:', error)
    });


    useEffect(() => {
      const access_token = Cookies.get('access_token');
      if (access_token) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    }, []);


    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

  

    return (
        <div style={{height: "100%"}}>
          
            {profile ? (
              
                <div style={{height: "100%"}}>
                  <Header setSidebar={setSidebar} showSidebar={showSidebar} email={profile?.email} setEmail={setProfile}/>
                  
                  <Body showSidebar={showSidebar} email={profile.email} setEmail={setProfile}/>
                    
                </div>
            ) : (
              <div  style={{height: "100%"}}>
                  
                  <Header setSidebar={setSidebar} showSidebar={showSidebar} email={profile?.email} setEmail={setProfile}/>
                  <button style={{marginTop: "300px"}} onClick={() => login()}>Sign in with Google  </button>
                    
                </div>
              
                
            )}
        </div>
    );
}
export default App;






