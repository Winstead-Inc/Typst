const { DetectKnrSlop } = require("./test_knr_full_spec.js");

console.log("=== RUNNING FULL SPEC TESTS ===");

function assert(condition, message) {
    if (!condition) {
        console.error("FAIL:", message);
        process.exit(1);
    } else {
        console.log("PASS:", message);
    }
}

// 1. Clean LAFS Code
const t1 = `#set page
(
  paper: "a4",
  margin: 2cm
)
#set text
(
  font: "Liberation Sans"
)
`;
assert(!DetectKnrSlop(t1).HasError, "Clean LAFS code has no errors");

// 2. K&R Slop Vector 1 Preceding in Code
const t2 = `#set text(
  font: "Liberation Sans"
)`;
const r2 = DetectKnrSlop(t2);
assert(r2.HasError && r2.PrimaryError.Vector === 1 && r2.PrimaryError.Subtype === "PRECEDING", "K&R opener attached in code triggers Vector 1 Preceding");

// 3. K&R Slop Vector 1 Proceeding in Code
const t3 = `#set text
( font: "Liberation Sans"
  size: 11pt
)`;
const r3 = DetectKnrSlop(t3);
assert(r3.HasError && r3.PrimaryError.Vector === 1 && r3.PrimaryError.Subtype === "PROCEEDING", "K&R opener with proceeding code triggers Vector 1 Proceeding");

// 4. K&R Slop Vector 2 Preceding in Code (Closing Hug)
const t4 = `#set text
(
  font: "Liberation Sans" )`;
const r4 = DetectKnrSlop(t4);
assert(r4.HasError && r4.PrimaryError.Vector === 2 && r4.PrimaryError.Subtype === "PRECEDING", "Closing hug in code triggers Vector 2 Preceding");

// 5. Clean LAFS Math
const t5 = `$
  mat
  (
    1, 2;
    3, 4
  )
$`;
assert(!DetectKnrSlop(t5).HasError, "Clean LAFS Math has no errors");

// 6. K&R Slop Vector 1 Preceding in Math (mat() attached)
const t6 = `$
  mat(
    1, 2;
    3, 4
  )
$`;
const r6 = DetectKnrSlop(t6);
assert(r6.HasError && r6.PrimaryError.Vector === 1 && r6.PrimaryError.Subtype === "PRECEDING", "mat( attached in math triggers Vector 1 Preceding");

// 7. K&R Slop Vector 2 Preceding in Math (closing hug 3, 4 ) )
const t7 = `$
  mat
  (
    1, 2;
    3, 4 )
$`;
const r7 = DetectKnrSlop(t7);
assert(r7.HasError && r7.PrimaryError.Vector === 2 && r7.PrimaryError.Subtype === "PRECEDING", "Closing hug in math triggers Vector 2 Preceding");

// 8. Monolith Math
const t8 = `$mat(1, 2; 3, 4)$
$vec(x, y, 1)$`;
assert(!DetectKnrSlop(t8).HasError, "Monolith Math has no errors");

// 9. Monolith Code
const t9 = `#set text(font: "Liberation Sans", size: 11pt)`;
assert(!DetectKnrSlop(t9).HasError, "Monolith Code has no errors");

// 10. Container Grouping
const t10 = `table.cell
[{(
  "ModuleA",
  "ModuleB"
)}]`;
assert(!DetectKnrSlop(t10).HasError, "Container Grouping has no errors");

// 11. Mismatched Container Grouping
const t11 = `table.cell
[{(
  "ModuleA",
  "ModuleB"
)]}`;
const r11 = DetectKnrSlop(t11);
assert(r11.HasError && r11.PrimaryError.Vector === 2 && r11.PrimaryError.Subtype === "MISMATCH", "Mismatched container grouping triggers Vector 2 MISMATCH");

// 12. Display Math with label glue
const t12 = `$
  integral_0^1 x dif x
$ <eq:test>`;
assert(!DetectKnrSlop(t12).HasError, "Display Math with label glue has no errors");

// 13. Multiline Display Math with attached opener
const t13 = `$ integral_0^1 x dif x
  = 1/2
$`;
const r13 = DetectKnrSlop(t13);
assert(r13.HasError && r13.PrimaryError.Vector === 1 && r13.PrimaryError.Subtype === "PROCEEDING", "Display math opener with proceeding code triggers Vector 1 PROCEEDING");

console.log("\nALL SPEC TESTS PASSED SUCCESSFULLY!");

