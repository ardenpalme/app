// postcss.polotno.mjs  (use ONLY for generating the scoped vendor CSS)
import prefix from "postcss-prefix-selector";
import postcssUrl from "postcss-url";

export default {
  plugins: [
    prefix({
      prefix: ".polotno-scope",
      transform(p, sel) {
        // Split lists like "html, body" and scope each part
        return sel.split(",").map((s) => {
          s = s.trim();

          // Root selectors → just the scope (you can't nest html/body inside a div)
          if (s === "html" || s === "body" || s === ":root") return p;

          // Common resets → scope to descendants of the wrapper
          if (s === "*" || s === "*::before" || s === "*::after") return `${p} *`;
          if (s.replace(/\s/g, "") === "*,*::before,*::after") return `${p} *`;

          // Selection highlight
          if (s.includes("::selection") || s.includes("::-moz-selection")) return `${p} ${s}`;

          // Default: prefix everything else
          return `${p} ${s}`;
        }).join(", ");
      },
    }),

    // Copies fonts referenced by blueprint-icons.css & rewrites URLs
    postcssUrl({
      url: "copy",
      assetsPath: "public/blueprint",               // where to copy fonts to
      publicPath: "/blueprint",                     // how the CSS should reference them
      useHash: false,
      // CSS file is: node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css
      // Its URLs are like ../fonts/blueprint-icons-16.woff2
      basePath: "node_modules/@blueprintjs/icons/lib/css",
    }),
  ],
};

