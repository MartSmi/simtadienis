class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    enqueue(value) {
        const node = new Node(value);

        if (this.head) {
            this.tail.next = node;
            this.tail = node;
        } else {
            this.head = node;
            this.tail = node
        }

        this.length++;
    }

    dequeue() {
        const current = this.head;
        this.head = this.head.next;
        this.length--;

        return current.value;
    }

    isEmpty() {
        return this.length === 0;
    }

    getHead() {
        return this.head.value;
    }

    getLength() {
        return this.length;
    }

    print() {
        let current = this.head;

        while(current) {
            console.log(current.value);
            current = current.next;
        }
    }
}

// const queue = new Queue();
// console.log('is empty?', queue.isEmpty())
// console.log('add 10');   queue.enqueue(10)
// console.log('add 50');   queue.enqueue(50)
// console.log('add 100');  queue.enqueue(100);
// console.log('remove',    queue.dequeue())
// console.log('Queue ↓');  queue.print()
// console.log('is empty?', queue.isEmpty())
// console.log('Length',    queue.getLength())
// console.log('Head', queue.getHead())


class Graph {

    bfs (fr) {
        let w = this.level.levelWidth;
        let h = this.level.levelHeight;
        // console.log(h);
        // console.log(w);
        var dist = [...Array(h)].map(a => Array(w).fill(-1));
        var pr = [...Array(h)].map(a => Array(w).fill({
            i: -1,
            j: -1
        }));

        const queue = new Queue ();
        dist[fr.i][fr.j] = 0;
        pr[fr.i][fr.j] = {
            i: fr.i,
            j: fr.j
        };
        queue.enqueue(fr);

        while (!queue.isEmpty()) {
            let v = queue.dequeue();

            for (var di = -1; di <= 1; di++) {
                for (var dj = -1; dj <= 1; dj++) {
                    if (!( (di == 0 && dj == 0) || (di != 0 && dj != 0) )) {
                        let u = {
                            i: v.i + di,
                            j: v.j + dj
                        };

                        if (this.level.canGhostGo (u.i, u.j) && dist[u.i][u.j] == -1) {
                            dist[u.i][u.j] = dist[v.i][v.j] + 1;
                            pr[u.i][u.j] = v;
                            // let idU = this.level.getId (u.i, u.j);
                            // let idV = this.level.getId (v.i, v.j);
                            // let idFr = this.level.getId (fr.i, fr.j);
                            // this.goto[idFr][idU] = v;
                            queue.enqueue(u);
                        }
                    }
                }
            }
        }

        let idFr = this.level.getId (fr.i, fr.j);
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                let idU = this.level.getId (i, j);
                this.goto[idFr][idU] = pr[i][j];
            }
        }

        //if (pr[to.i][to.j].i == -1) console.log("HERERERERE! :(((((");

        // return pr[to.i][to.j];
    }

    constructor (game, level) {
        this.game = game;
        this.level = level;

        //console.log(this.nodeFrom);
        //console.log(this.nodeTo);

        let w = this.level.levelWidth;
        let h = this.level.levelHeight;
        this.goto = [...Array(h*w)].map(a => Array(h*w).fill({
            i: -1,
            j: -1
        }));
        
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                let fr = {
                    i: i,
                    j: j
                };
                this.bfs (fr);
            }
        }

    }

    getNextIntersectionInShortestRoute (fr, to) {
        // let id = this.bfs (to, fr);
        // console.log(" fr, to, id");
        // console.log(fr);
        // console.log(to);
        // console.log(id);
        let idFr = this.level.getId (fr.i, fr.j);
        let idTo = this.level.getId (to.i, to.j);
        let id = this.goto[idTo][idFr];
        return id;
    }

    /* drawNode (v) {
        let pos1 = this.game.convertGraphIdToPos(this.idToPos.get(v));
        ctx.beginPath();
        ctx.arc(pos1.x, pos1.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawEdge (u, v) {
        let pos1 = this.game.convertGraphIdToPos(this.idToPos.get(u));
        let pos2 = this.game.convertGraphIdToPos(this.idToPos.get(v));
        
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
    }

    drawGraph (ctx) {

        ctx.strokeStyle = 'yellow';
        for (var i = 0; i < this.edges.length; i++) {
            let u = this.edges[i].u;
            let v = this.edges[i].v;

            this.drawEdge(u,v);
        }

        for (var i = 0; i < this.nodeCount; i++) {
            this.drawNode(i);
        }

        ctx.strokeStyle = 'red';
        this.drawNode(this.nodeFrom);
        this.drawNode(this.nodeTo);
    }


    addEdgesTo (i, j) {
        let nearIntersections = this.level.getNearIntersections(i, j);
        for (var k = 0; k < nearIntersections.length; k++) {
            let intersection = nearIntersections[k];
            // console.log("after this an intersection");
            // console.log(intersection);
            let u = this.level.getId(i, j);
            let v = this.level.getId(intersection.x, intersection.y);

            if (!this.mapToId.has(u)) {
                this.mapToId.set(u, this.nodeCount);
                this.idToPos.set(this.nodeCount, u);
                this.nodeCount++;
            }

            if (!this.mapToId.has(v)) {
                this.mapToId.set(v, this.nodeCount);
                this.idToPos.set(this.nodeCount, v);
                this.nodeCount++;
            }

            let edgeWeight = Math.abs(i - intersection.x) + Math.abs(j - intersection.y);

            this.edges.push ({
                u: this.mapToId.get(u),
                v: this.mapToId.get(v),
                w: edgeWeight,
            });

        }
    }

    constructGraph (posFrom, posTo) {
        for (var i = 0; i < this.level.levelHeight; i++) {
            for (var j = 0; j < this.level.levelWidth; j++) {
                if (this.level.intersections[i][j]) {
                    this.addEdgesTo(i, j);
                }
            }
        }

        let fromIdInArray = this.level.posToId (posFrom);
        let fromI = fromIdInArray.i;
        let fromJ = fromIdInArray.j;

        let toIdInArray = this.level.posToId (posTo);
        let toI = toIdInArray.i;
        let toJ = toIdInArray.j;

        this.addEdgesTo(fromI, fromJ);
        this.addEdgesTo(toI, toJ);

        this.nodeFrom = this.mapToId.get(this.level.getId(fromI, fromJ));
        this.nodeTo = this.mapToId.get(this.level.getId(toI, toJ));

        // console.log("nodeCount: " + nodeCount);
        // console.log(mapToId);
        // mapToId.forEach((values, keys) => {
        //   console.log("key: " + keys.i + " , " + keys.j + "  values: " + values);
        // });

        // console.log(this.edges);
    }

    constructor (game, level, posFrom, posTo) {
        this.game = game;
        this.level = level;

        this.edges = [];
        this.mapToId = new Map();
        this.idToPos = new Map();
        this.nodeCount = 0;
        
        this.constructGraph (posFrom, posTo);

        //console.log(this.nodeFrom);
        //console.log(this.nodeTo);
    }

    dijkstra (fr, to, nodeCount, edges) {
        //console.log("dijkstraa started");
        var dist = [...Array(nodeCount)].fill(-1);
        var pr = [...Array(nodeCount)].fill(-1);
        var vis = [...Array(nodeCount)].fill(false);

        dist[fr] = 0;
        var nxt = fr;
        while (nxt != -1) {
           // console.log(nxt);
            let v = nxt;
            vis[v] = true;
            nxt = -1;

            for (var i = 0; i < edges.length; i++) {
                let eu = edges[i].u;
                let ev = edges[i].v;
                let ew = edges[i].w;

                if (eu == v || ev == v) {
                    let u;
                    if (eu == v) u = ev;
                    else u = eu;

                    if (!vis[u] && (dist[u] == -1 || dist[u] > dist[v] + ew)) {
                        dist[u] = dist[v] + ew;
                        pr[u] = v;
                    }
                }
            }

            for (var u = 0; u < nodeCount; u++) {
                if (dist[u] != -1 && !vis[u] && (nxt == -1 || dist[nxt] > dist[u]))
                    nxt = u;
            }

        }

        //for (var i = 0; i < nodeCount; i++) {
        //    console.log(" i=" + i + " id: " + this.idToPos.get(i) + " dist: " + dist[i] + " pr: " + pr[i]);
       // }

        //console.log("dijkstra ended")
        if (pr[to] == -1) return to;
        else return pr[to];
    }

    getNextIntersectionInShortestRoute () {
        let fr = this.nodeFrom;
        let to = this.nodeTo;
        let id = this.dijkstra (to, fr, this.nodeCount, this.edges);
        
        //let id = 0;
        return this.idToPos.get(id);
    } */

}