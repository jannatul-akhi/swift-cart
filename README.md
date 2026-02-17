# SwiftCart Project

## Questions & Answers (Bangla)

#### 1) What is the difference between `null` and `undefined`?
**উত্তর:**
null আর undefined এর পার্থক্য

undefined তখন হয় যখন কোনো ভেরিয়েবল declare করা হয়েছে কিন্তু তাকে কোনো value দেওয়া হয়নি। মানে JavaScript নিজে বুঝায় যে এখনো কোনো মান সেট করা হয়নি।

আর null আমরা নিজেরা দেই। এটা ইচ্ছা করে খালি মান বোঝাতে ব্যবহার করা হয়। মানে এখানে কোনো value নাই, কিন্তু সেটা আমরা নিজে সেট করেছি।

সংক্ষেপে বললে,
undefined = value দেওয়া হয়নি
null = ইচ্ছা করে খালি রাখা হয়েছে

#### 2) What is the use of the `map()` function in JavaScript? How is it different from `forEach()`?
**উত্তর:**
map() এর ব্যবহার এবং forEach() থেকে পার্থক্য

map() ব্যবহার করা হয় যখন আমরা একটা array থেকে নতুন আরেকটা array বানাতে চাই। মানে প্রতিটা element এর উপর কাজ করে নতুন array return করে।

forEach() শুধু প্রতিটা element এর উপর কাজ করে, কিন্তু কোনো নতুন array return করে না। সাধারণত শুধু loop চালানোর জন্য ব্যবহার করা হয়।

তাই যদি নতুন array দরকার হয় তাহলে map(), আর শুধু iterate করতে হলে forEach()।

#### 3) What is the difference between `==` and `===`?
**উত্তর:**
== আর === এর পার্থক্য

== শুধু value মিলায়। দরকার হলে type convert করে নেয়।
=== value আর type দুটোই মিলায়। কোনো type convert করে না।

যেমন 5 == "5" true হবে।
কিন্তু 5 === "5" false হবে।

সাধারণত === ব্যবহার করাই ভালো।

#### 4) What is the significance of `async`/`await` in fetching API data?
**উত্তর:**
async/await এর গুরুত্ব

API থেকে data আনতে সময় লাগে। এটা asynchronous কাজ। async/await ব্যবহার করলে কোড দেখতে normal synchronous এর মতো লাগে কিন্তু ভিতরে asynchronous ভাবে কাজ করে।

এতে কোড পড়তে সহজ হয় এবং error handle করাও সহজ হয়। Promise এর then ব্যবহার না করেও কাজ করা যায়।

#### 5) Explain the concept of Scope in JavaScript (Global, Function, Block).
**উত্তর:**
Scope কী (Global, Function, Block)

Scope মানে হলো কোন ভেরিয়েবল কোথায় ব্যবহার করা যাবে।

Global scope এর ভেরিয়েবল সব জায়গা থেকে ব্যবহার করা যায়।

Function scope এর ভেরিয়েবল শুধু সেই function এর ভিতরে ব্যবহার করা যায়।

Block scope এর ভেরিয়েবল (let, const দিয়ে declare করলে) শুধু {} এর ভিতরে কাজ করে।
