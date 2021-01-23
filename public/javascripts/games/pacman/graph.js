class Graph {

    drawNode (v) {
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
    }

}