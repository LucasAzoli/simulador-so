

// Queue class to help with the FIFO algorithm and adapt it to the LRU algorithm
class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(item) {
      this.items.push(item);
    }
  
    first() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items.shift();
    }
  
    front() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items[0];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    size() {
      return this.items.length;
    }

    // used in LRU algorithm
    remove(item) {
        let index = this.items.indexOf(item);
        if(index > -1) {
            this.items.splice(index, 1);
        }
    }
  }



// create a class called Memory


class Memory {
    constructor(algorithm) {
        this.memsize = 50;
        this.memory = new Array(50); 
        this.algorithm = algorithm; // consider this to be a string ("FIFO" or "LRU")
        this.free = this.memsize; // free space in memory
        this.active = new Queue(); // active processes in memory
        this.LRU = new Queue(); // least recently used processes in memory
    }

 


    // operations with memory
    allocate(process) {
      // check if the process is already in memory
      for(let i = 0; i < this.memsize; i++) {
        if(this.memory[i] == process) {
            if(this.algorithm == "LRU") { // updating the LRU queue
                this.LRU.remove(process);
                this.LRU.enqueue(process);
            }
            return;
        }
      }

        // check if there is enough space in the memory to allocate the process

        while(process.size() > this.free) {
          // if there is not enough space, apply the algorithm to free up space and allocate the memory
            if(this.algorithm == "FIFO") {
                let change = this.active.first(); // get the first process in the queue( First in)
                for(let i = 0; i < this.memsize; i++) {
                    if(this.memory[i] == change) { // find the space in memory that the process is occupying
                        this.memory[i] = undefined; // free up the space
                    }
                }
                this.free += process.size(); // update the free space
                
            }else{
                let change = this.LRU.first(); // get the least recently used process
                for(let i = 0; i < this.memsize; i++) {
                    if(this.memory[i] == change) { // find the space in memory that the process is occupying
                        this.memory[i] = undefined; // free up the space
                    }
                }
                this.free += process.size(); // update the free space
            }
        }


        // if there is enough space, allocate the memory and return the updated memory state
        let aux = 0;

        for(let i = 0; i < this.memsize; i++) {
            if(process.size = aux){
                break;
            }
            if(this.memory[i] == undefined) {
                this.memory[i] = process;
                this.free -= size;
                aux++;
            }
        }
        this.LRU.enqueue(process); // add the process to the queue (LAST USED)
        this.active.enqueue(process); // add the process to the queue
        return;

    }

    getMemoryState() {
        return this.memory;
    }

}

