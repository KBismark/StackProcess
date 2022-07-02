/**
* Accepts a function (starter function) to be registerd in the process chain.
* 
 * @param {(data:*)} starter_function This function may take one argument. A call to `seal(starter_arg)` 
 * calls this function directly.
 */
 function StackProcess(starter_function){
    var nexts=[],first_pop=false;
    /**
     * Accepts a function to be registerd in the process chain.
     * 
     * @param {(data:*)} cb This function may take one argument.
     * @example 
     * ``js
     *  var fs = require("fs");
     *  var stack = new StackProcess((starter_param)=>{
     *      //do stuff...
     *      fs.readFile(filePath,"utf8",(err,data)=>{
     *          if(err){
     *              //call the next process function and pass err as argument
     *              stack.next(err);
     *          }else{
     *              //call the next process function and pass data as argument
     *              stack.next(data);
     *          }
     *      });
     *  }).then((passed_data)=>{
     *      console.log(passed_data); //logs err or data
     *      stack.clear();   //very useful
     *  })
     * 
     * `
     */
    this.then=function(cb){
        if(!first_pop){
            nexts.push(cb);
        };
        return this;
    };
    /**
     * This function executes the next process function on the stack.
     * 
     * Accepts one argument or undefined which is passed on to the next process function on the stack.
     * 
     * @param {*} data  
     */
    this.next=function(data){
        if(nexts.length<1||!first_pop){
           return;
        };
        nexts.shift()(data);
    };
    /**
     * Seals the stack process chain and instructs execution to begin. 
     * 
     * Accepts one argument or undefined which is passed on to the process starter function.
     * 
     * **Note:** This method closes the stack and begins the process execution. All `then()'s` 
     * after calling `seal()` will not be executed.
     * 
     * @param {*} data 
     */
    this.seal=function(data){
        if(first_pop){return this};
        first_pop=true;
        starter_function(data);
        return this;
    };
    /**
     * Clears the stack. A cleared stack can not be reused. 
     * 
     * **Note:** It is always advisable to clear the stack if stack object is nomore needed.
     */
    this.clear=function(){
        nexts=null;
        this.then=null;
        this.next=null;
        this.seal=null;
        this.clear=null;
        starter_function=null;
        first_pop=null;
    }
};
//module.exports = StackProcess;
