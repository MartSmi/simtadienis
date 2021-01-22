class Graph {
    
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
    }

    dijkstra (fr, to) {
        console.log("dijkstraa started");
        var dist = [...Array(this.nodeCount)].fill(-1);
        var pr = [...Array(this.nodeCount)].fill(-1);
        var vis = [...Array(this.nodeCount)].fill(false);

        dist[fr] = 0;
        var nxt = 0;
        while (nxt != -1) {
            console.log(nxt);
            let v = nxt;
            vis[v] = true;
            nxt = -1;

            for (var i = 0; i < this.edges.length; i++) {
                let eu = this.edges[i].u;
                let ev = this.edges[i].v;
                let ew = this.edges[i].w;

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

            for (var u = 0; u < this.nodeCount; u++) {
                if (dist[u] != -1 && !vis[u] && (nxt == -1 || dist[nxt] > dist[u]))
                    nxt = u;
            }

        }

        var cur = to;
        var lst = to;
        while (pr[cur] != -1) {
            lst = cur;
            cur = pr[cur];
        }

        console.log("dijkstra ended")
        return lst;
    }

    getNextIntersectionInShortestRoute (fr = this.nodeCount-2, to = this.nodeCount-1) {
        //let id = this.dijkstra (fr);
        let id = 0;
        return this.idToPos.get(id);
    }
}