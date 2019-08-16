declare module 'ci-parallel-vars' {
    type Vars = { index: number; total: number } | null;
    let ciParallelVars: Vars;
    export = ciParallelVars;
}
