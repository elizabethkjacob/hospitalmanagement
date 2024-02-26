

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = path.join(__dirname, 'hospitaldata.json');
app.use(express.json());


//  read hospital data 
function readData() {
    try{
    const Data = fs.readFileSync(dataFilePath,'utf8');
    return JSON.parse(Data);
   }catch(error){
    console.error('error reading data:',error)
    return[]
   }
}



// write hospital 
function writeData(data) {
    try{
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('data writtern sucessfully.');
    } catch(error){
        console.error('error writing data:',error)
    }
}

//  GET request
app.get('/hospitals',(req, res)=> {
        const hospitals = readData();
        res.end(JSON.stringify(hospitals));
    
    
});
app.get('/hospitals/:name',(req,res)=>{
    const hospitals = readData();
    const hospital=hospitals.find(h=>h.name ===req.params.name);
    if(!hospital){
        res.status(404).send('hospital not found');
    }else{
        res.json(hospital);
    }

});
//  POST request
app.post('/hospitals',(req, res)=> {
    const hospitals = readData();
    const newHospital = req.body;
    hospitals.push(newHospital);
    writeData(hospitals);
    res.status(201).json(newHospital)
            
   
});

//  PUT request
app.put('/hospitals/:name',(req, res)=> {
   const hospitals = readData();
   const index=hospitals.findIndex(h=>h.name ===req.params.name);
   if(index=== -1){
    res.status(404).send('hospital not found');
   }else{
    hospitals[index]=req.body;
    writeData(hospitals);
    res.json(hospitals[index])
   }
});

//  DELETE request


app.delete('/hospitals/:name',(req, res)=> {
    const hospitals = readData();
    const index = hospitals.findIndex(h=>h.name===req.params.name);
    if(index === -1){
     res.status(404).send('hospitals not found')
    }else{
     const deletedHospital= hospitals.splice(index,1)[0];
     writeData(hospitals);
     res.json(deletedHospital);
    }
 }); 



app.listen(PORT, () => {
    console.log(`Server is running  ${PORT}`);
});


