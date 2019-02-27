const express= require('express');
const cors= require('cors');
const monk= require('monk');
const app= express();
const Filter =  require('bad-words');



const db= monk('localhost/meower');

const mews = db.get('mews');
const filter= new Filter();

app.use(cors());
app.use(express.json());
app.get('/',(req, res)=> {

res.json({
    message: 'meower!'
});
});

app.get('/mews', (req,res)=>{
    mews
    .find()
    .then(mews=>{
        res.json(mews);
        }) ;

});

app.get('/v2/mews', (req,res) =>{
    // let skip= Number(req.query.skip) || 0;
    // let limit= Number(req.query.skip) || 10;
 let { skip= 0, limit= 5 , sort= 'desc'} = req.query;
  skip= isNaN(skip) ? 0 : Number(skip);
  limit= isNaN(limit) ? 5 : Number(limit);
  limit= limit >50 ? 50 : limit;

Promise.all([
    
    mews
    .count(),
     mews
    .find({}, {
        skip,
        limit,
        sort: {
            created: sort == 'desc' ? -1 : 1
        }
    })
])
    
.then(([total, mews])  => {
    res.json({

        left: total- (skip +limit),
        mews,
        meta: {
        total,
            
            skip,
            limit,
            has_more : total- (skip+limit) > 0,

        }
      
        


    });
    }) ;

});

function isValidMew(mew){
    return mew.name && mew.name.toString().trim() !== '' && 
    mew.content && mew.content && mew.content.toString().trim() != '';
}

app.post('/mews', (req,res)=>{
    if(isValidMew(req.body)){
       //insert into db ;
       const mew={
           name: filter.clean(req.body.name.toString()),
           content: filter.clean(req.body.content.toString()),
           created: new Date()
        };
       mews.insert(mew)
       .then(createdMew =>{
           res.json(createdMew);
       });


    } else{
        res.status(422);
        res.json({
            message: "hey! name and content are required"
        });
    }
});

app.listen(5000, ()=>{
    console.log('listening on http://localhost:5000');
});