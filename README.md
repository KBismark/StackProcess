# StackProcess    
JavaScript promises are commonly known to be a placeholder for a value that would be made availabe in the future. 
They allow asynchronous functions to return values like synchronous methods instead of immediately returning the final value. This allows 
asynchronous methods to return a promise to supply the value at some point in the future.    

A StackProcess functions similarly to how a JavaScript promise works. A StackProcess ensures asynchronous methods are readable as synchronous 
methods. It allows you to chain your next executable functions that depends on the result of an asynchronous method. A StackProcess pushes 
your next executable functions on a stack which are then popped for execution after previous functions on the stack are executed. A call to the `next()`
method of the StackProcess instructs the StackProcess to execute the next executable function on the stack.

```js
var fs = require("fs");
var http = require("http");

//this is the function StackProcess will begin execution with
function starterMethod(starter_param){

    //do stuff...
    fs.readFile(filePath,"utf8",(err,data)=>{
      if(err){
          //call the next process function and pass err as argument
          stack.next({ERROR:err});
      }else{
          //call the next process function and pass data as argument
          stack.next({ERROR:null,data:data});
      }
  });
  
};

var stack = new StackProcess(starterMethod)
.then((passed_data)=>{
  
   if(!passed_data.ERROR){
   
        http.get("some_url_to_get_data",(res)=>{
            var chunks=[];
            res.on("data",(chunk)=>{
                chunks.push(chunk);
            }).on("end",()=>{
            //call the next process function and pass buffered data as argument
                stack.next(Buffer.concat(chunks);
            });
        });
        
   }else{
   
      console.log(passed_data.ERROR);
      //Clear the stack since the next functions on the stack won't be called. 
      stack.clear(); //very useful
      
   }
   
}).then((data)=>{
  //Do something with data....
   
}).seal(); 
//seal() closes the stack and begin execution from the starterMethod to the last then() or till stack.clear()
// NOTE: Calling any method of the StackProcess after stack.clear() will result in an error.


```

Basically, all methods associated with a StackProcess is used in the above code.     
- `.then(next_executable_function)`
- `.next(argument_to_the_next_executable_function)`
- `.seal(argument_to_the_starter_function)`
- `.clear()`

Good Luck!
