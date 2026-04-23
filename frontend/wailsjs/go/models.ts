export namespace main {
	
	export class ScanRequest {
	    target: string;
	    ports: string;
	    versionScan: boolean;
	    osScan: boolean;
	    udpScan: boolean;
	    extraArgs: string;
	
	    static createFrom(source: any = {}) {
	        return new ScanRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.target = source["target"];
	        this.ports = source["ports"];
	        this.versionScan = source["versionScan"];
	        this.osScan = source["osScan"];
	        this.udpScan = source["udpScan"];
	        this.extraArgs = source["extraArgs"];
	    }
	}
	export class ScanResult {
	    command: string[];
	    output: string;
	    exitCode: number;
	
	    static createFrom(source: any = {}) {
	        return new ScanResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.command = source["command"];
	        this.output = source["output"];
	        this.exitCode = source["exitCode"];
	    }
	}

}

