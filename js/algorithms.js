function random_int(n) {
    return Math.floor(Math.random() * n)
}


class Queue {
    constructor() {
        this.array = [];
        this.length = 0;
    }

    push(element) {
        this.array.push(element);
        this.length++;
    }

    pop() {
        this.array.shift();
        this.length--;
    }

    tail() {
        return this.array[this.length - 1];
    }

    body() {
        return this.array.slice(0, this.length - 1);
    }
}


export {
    random_int, Queue
}