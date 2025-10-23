        // دالة لإنشاء معرض
        function initGallery(galleryId) {
            const gallery = document.getElementById(galleryId);
            const images = gallery.querySelectorAll('.image-wrapper img');
            const prevBtn = gallery.querySelector('.prev-btn');
            const nextBtn = gallery.querySelector('.next-btn');
            const dotsContainer = gallery.querySelector('.dots-container');
            let currentIndex = 0;
            
            // إنشاء نقاط التنقل
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if(index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToImage(index);
                });
                dotsContainer.appendChild(dot);
            });
            
            const dots = gallery.querySelectorAll('.dot');
            
            function goToImage(index) {
                images[currentIndex].classList.remove('active');
                dots[currentIndex].classList.remove('active');
                
                currentIndex = index;
                
                images[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            }
            
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                goToImage(newIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                goToImage(newIndex);
            });
            
            // التمرير التلقائي
            let interval = setInterval(() => {
                const newIndex = (currentIndex + 1) % images.length;
                goToImage(newIndex);
            }, 3000);
            
            gallery.addEventListener('mouseenter', () => {
                clearInterval(interval);
            });
            
            gallery.addEventListener('mouseleave', () => {
                interval = setInterval(() => {
                    const newIndex = (currentIndex + 1) % images.length;
                    goToImage(newIndex);
                }, 3000);
            });
        }
        
        // تهيئة جميع المعارض
        document.addEventListener('DOMContentLoaded', () => {
            initGallery('gallery1');
            initGallery('gallery2');
            initGallery('gallery3');
            initGallery('gallery4');
        });

// سياسة الحصوصية


  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(acc => {
    acc.querySelector('.accordion-header').addEventListener('click', () => {
      const content = acc.querySelector('.accordion-content');
      const isOpen = content.style.display === 'block';
      // إغلاق كل الأقسام أولاً
      document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
      // فتح القسم الحالي إذا كان مغلقًا
      content.style.display = isOpen ? 'none' : 'block';
    });
  });

  // comment


  // إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ8tAmRbzs38JHXo5c3xgpn0O23V8M2ak",
  authDomain: "rice-sit.firebaseapp.com",
  projectId: "rice-sit",
  storageBucket: "rice-sit.firebasestorage.app",
  messagingSenderId: "919520523069",
  appId: "1:919520523069:web:c0ceea8f34310a5eba0b54",
  measurementId: "G-W57GGNKL8X"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// عناصر الصفحة
const stars=document.querySelectorAll(".stars span");
const commentInput=document.getElementById("comment");
const usernameInput=document.getElementById("username");
const submitBtn=document.getElementById("submit");
const avgDisplay=document.getElementById("avgDisplay");
const reviewsList=document.getElementById("reviewsList");
const adminReviewsList=document.getElementById("adminReviewsList");
const adminSection=document.getElementById("adminSection");
const adminLoginBtn=document.getElementById("adminLoginBtn");
const adminLogoutBtn=document.getElementById("adminLogoutBtn");
const deleteMessage=document.getElementById("deleteMessage");
let selectedRating=0;
if(localStorage.getItem("username")) usernameInput.value=localStorage.getItem("username");

// اختيار النجوم
stars.forEach(star=>{
  star.addEventListener("click",()=>{
    selectedRating=parseInt(star.dataset.value);
    stars.forEach(s=>s.classList.remove("active"));
    for(let i=0;i<selectedRating;i++) stars[i].classList.add("active");
  });
});

// ارسال تقييم
const sendRating=async()=>{
  const username=usernameInput.value.trim()||"مستخدم مجهول";
  const comment=commentInput.value.trim();
  if(selectedRating===0) return alert("الرجاء اختيار عدد النجوم ⭐");
  if(!comment) return alert("الرجاء كتابة تعليق 📝");
  try{
    localStorage.setItem("username",username);
    await db.collection("ratings").add({username,value:selectedRating,comment,date:new Date().toISOString()});
    commentInput.value=""; selectedRating=0; stars.forEach(s=>s.classList.remove("active"));
  }catch(err){console.error(err);alert("❌ حدث خطأ أثناء الإرسال");}
};
submitBtn.onclick=sendRating;

// تعديل تعليق مباشر
function editComment(id, username, value, comment){
  usernameInput.value=username;
  commentInput.value=comment;
  selectedRating=value;
  stars.forEach(s=>s.classList.remove("active"));
  for(let i=0;i<value;i++) stars[i].classList.add("active");
  submitBtn.textContent="تحديث التعليق";

  submitBtn.onclick=async()=>{
    const updatedComment=commentInput.value.trim();
    if(!updatedComment) return alert("الرجاء كتابة تعليق 📝");
    try{
      await db.collection("ratings").doc(id).update({value:selectedRating,comment:updatedComment,date:new Date().toISOString()});
      // تحديث الواجهة مباشرة
      document.querySelectorAll(".review").forEach(div=>{
        const h4=div.querySelector("h4");
        const p=div.querySelector("p");
        if(h4.textContent.includes(username)){
          h4.innerHTML=`${username} - ${"⭐".repeat(selectedRating)}`;
          p.textContent=updatedComment;
        }
      });
      commentInput.value=""; selectedRating=0; stars.forEach(s=>s.classList.remove("active"));submitBtn.textContent="إرسال التقييم";submitBtn.onclick=sendRating;
    }catch(err){console.error(err);}
  }
}

// حذف تعليق نهائي مع رسالة تأكيد
function deleteComment(id){
  if(!confirm("هل أنت متأكد من حذف هذا التعليق نهائياً؟")) return;
  db.collection("ratings").doc(id).delete()
    .then(()=>{deleteMessage.style.display="block"; setTimeout(()=>{deleteMessage.style.display="none";},3000);})
    .catch(err=>{console.error(err); alert("❌ حدث خطأ أثناء الحذف");});
}

// تسجيل دخول المسؤول
adminLoginBtn.onclick=async()=>{
  const email=prompt("ادخل البريد الالكتروني للمسؤول:");
  const password=prompt("ادخل كلمة المرور:");
  try{await auth.signInWithEmailAndPassword(email,password);alert("✅ تم تسجيل الدخول بنجاح!");}catch(err){alert("❌ فشل تسجيل الدخول");}
};
adminLogoutBtn.onclick=async()=>{await auth.signOut();alert("✅ تم تسجيل الخروج");};

// مراقبة التقييمات في الوقت الحقيقي
auth.onAuthStateChanged(user=>{
  if(user) adminSection.style.display="block"; else adminSection.style.display="none";

  db.collection("ratings").orderBy("date","desc").onSnapshot(snapshot=>{
    reviewsList.innerHTML="";
    adminReviewsList.innerHTML="";
    let total=0,count=0,counts={1:0,2:0,3:0,4:0,5:0};

    snapshot.forEach(doc=>{
      const data = doc.data();
      total += data.value; count++; counts[data.value]++;

      const avatarURL = `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`;
      const div = document.createElement("div"); div.className="review";

      let actions = "";
      if(localStorage.getItem("username") === data.username){
        actions =` <button onclick="editComment('${doc.id}','${data.username}',${data.value},\${data.comment.replace(//g,'\\')}\`)">✏ تعديل</button>
                   <button onclick="deleteComment('${doc.id}')">🗑 حذف</button>`;
      }

      div.innerHTML = `<img class="avatar" src="${avatarURL}" alt="Avatar">
        <div class="review-content">
          <h4>${data.username} - ${"⭐".repeat(data.value)}</h4>
          <p>${data.comment}</p>
          <small>${new Date(data.date).toLocaleString()}</small>
          ${actions}
        </div>`;
      reviewsList.appendChild(div);

      // إدارة التعليقات للمسؤول
      if(user){
        const adminDiv = document.createElement("div"); adminDiv.className="admin-review";
        adminDiv.innerHTML = `<div><strong>${data.username}</strong><span>${data.comment}</span></div>
          <div>
            <button onclick="editComment('${doc.id}','${data.username}',${data.value},\${data.comment.replace(//g,'\\')}\)">✏ تعديل</button>
            <button onclick="deleteComment('${doc.id}')">🗑 حذف</button>
          </div>`;
        adminReviewsList.appendChild(adminDiv);
      }
    });

    const avg = count ? (total/count).toFixed(1) : "-";
    avgDisplay.textContent = `⭐ متوسط التقييم: ${avg} من 5 — (${count} تقييم)`;

    for(let i=1;i<=5;i++){
      const bar = document.getElementById(`bar-${i}`);
      if(bar){ const percent = count ? (counts[i]/count)*100 : 0; bar.style.width = percent + "%"; }
    }
  });
});
