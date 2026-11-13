
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9ace5ee9-6f9c-56ca-8467-b435147c5984")}catch(e){}}();
const e=require(`./chunk-gGpyby2o.cjs`),t=require(`./meow-Cmqsflq2.cjs`),n=require(`./turbosnap-8uvSOsXN.cjs`),r=require(`./log-BI_UMjxm.cjs`),i=require(`./readStatsFile-BZQOIcua.cjs`);var a=e.a(t.t());const{STORYBOOK_BASE_DIR:o,STORYBOOK_CONFIG_DIR:s,WEBPACK_STATS_FILE:c}=process.env;async function l(e){let{flags:t,input:l}=(0,a.default)(`
    Usage
      $ chromatic trace [-b|--base-dir] [-c|--config-dir] [-s|--stats-file] [-u|--untraced] [-m|--mode] [<changed files>...]

    Options
      <changed files>...                    List of changed files relative to repository root.
      --stats-file, -s <filepath>           Path to preview-stats.json. Alternatively, set WEBPACK_STATS_FILE. (default: 'storybook-static/preview-stats.json')
      --storybook-base-dir, -b <dirname>    Relative path from repository root to Storybook project root. Alternatively, set STORYBOOK_BASE_DIR. Use when your Storybook is located in a subdirectory of your repository.
      --storybook-config-dir, -c <dirname>  Directory where to load Storybook configurations from. Alternatively, set STORYBOOK_CONFIG_DIR. (default: '.storybook')
      --untraced, -u <filepath>             Disregard these files and their dependencies. Globs are supported via picomatch. This flag can be specified multiple times.
      --mode, -m <mode>                     Set to 'expanded' to reveal the underlying list of files for each bundle, or set to 'compact' to only show a flat list of affected story files.
    `,{argv:e,description:`Trace utility for TurboSnap`,flags:{statsFile:{type:`string`,alias:`s`,default:c||`storybook-static/preview-stats.json`},storybookBaseDir:{type:`string`,alias:`b`,default:o||`.`},storybookConfigDir:{type:`string`,alias:`c`,default:s||`.storybook`},untraced:{type:`string`,alias:`u`,isMultiple:!0},mode:{type:`string`,alias:`m`}}}),u=r.t({},{logPrefix:``,logLevel:`info`}),d={log:u,options:{storybookBaseDir:t.storybookBaseDir,storybookConfigDir:t.storybookConfigDir,untraced:t.untraced,traceChanged:t.mode||!0},git:{rootPath:await n.z({log:u})},storybook:{baseDir:t.storybookBaseDir,configDir:t.storybookConfigDir}},f=await i.t(t.statsFile),p=l.map(e=>e.replace(/^\.\//,``)),m=p.find(e=>n.c(e));if(m)throw Error(`Unable to trace package manifest file (${m}) as that would require diffing file contents.`);await n.n(d,f,t.statsFile,p)}exports.main=l;
//# sourceMappingURL=trace-pmv5IdSD.cjs.map
//# debugId=9ace5ee9-6f9c-56ca-8467-b435147c5984
