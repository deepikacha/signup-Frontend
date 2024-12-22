document.getElementById('signup').addEventListener('submit', async function(event){
    event.preventDefault();
  const name=document.getElementById('name').value;
  const email=document.getElementById('email').value;
  const phoneno=document.getElementById('phoneno').value;
  const password=document.getElementById('password').value;

  if(!name|| !email|| !phoneno || !password){
    alert("please fill out all fields");
    return
  }
  console.log(name);
  try{
    const response=await fetch('http://localhost:3000/signup',{
     method:'POST',
     headers:{
      'Content-Type':'application/json'
     },
     body:JSON.stringify({name,email,phoneno,password}),
    })
    if(response.ok){
      alert("Sign up successful!");
      
    }
    else{
      alert("Sign up unsuccessful!")
    }
  }
  catch(Error){
    alert("failed to connect server");
    console.log(Error);
  }

})