class LRUCache{
    constructor(capacity){
        this.capacity=capacity
        this.map=new Map()
    }

    get(key){
        if(this.map.has(key)){
            const temp=this.map.get(key)
            this.map.delete(key)
            this.map.set(temp)
            return temp
        }
        return -1

    }

    set(key,val){
        if(this.map.has(key)) this.map.delete(key)

        else if  (this.map.size>=this.capacity) {
            this.map.delete(this.map.keys().next().value)
        }
        this.map.set(key,val)
    }
    clear(){
        this.map.clear()
    }
}


const cache= new LRUCache(2)
cache.set('1',1)
cache.set('2',2)
console.log(cache.get('1'))
cache.set('3',3)
console.log(cache.get('2'))
cache.set('4',4)
console.log(cache.get('1'))
console.log(cache.get('3'))
console.log(cache.get('4'))
cache.clear()
console.log(cache.get('4'))