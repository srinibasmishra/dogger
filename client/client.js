console.log("hello world");
const form= document.querySelector('form');
const loadMoreButton= document.querySelector('#loadMoreButton');
const loadingElement= document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL= 'http://localhost:5000/v2/mews';
loadingElement.style.display= 'none';

let skip= 0;
let limit= 5;

loadMoreButton.addEventListener('click', loadMore);

listAllMews();


form.addEventListener('submit', (event)=>{
    event.preventDefault();
const formData= new FormData(form);

const name= formData.get('name');
const content= formData.get('content');


const mew={
name,
content

};
    
    form.style.display= 'none';
    loadingElement.style.display= '';
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }

    }).then( response=> response.json())
    .then(createdMew=>{
        
        form.reset();
        form.style.display= '';
        listAllMews();
       
    })
});


function loadMore(){
    skip += limit;
    listAllMews();
}






function listAllMews(){

    mewsElement.innerHTML= '';

    fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
        .then(response=> response.json())
        .then(result=>{

           // console.log(mews);  

            
            
           result.mews.forEach(mew=> {
               
               
                const div= document.createElement('div');
                const header= document.createElement('h3');
               
               
                header.textContent= mew.name;
               
                const contents= document.createElement('p');
                contents.textContent= mew.content;
               
                const date= document.createElement('small');
                date.textContent= new Date(mew.created);
               
                div.appendChild(header);
               div.appendChild(contents);
               div.appendChild(date);

               mewsElement.appendChild(div);
               loadingElement.style.display= 'none';
 
            });
            loadingElement.style.display= 'none';
            loadMoreButton.style.visibility= 'visible';
         })

        
}

