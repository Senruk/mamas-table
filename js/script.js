/* Mama's Table — Site Scripts */

document.addEventListener('DOMContentLoaded',()=>{

  // --- Nav scroll ---
  const nav=document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
  }

  // --- Mobile nav toggle ---
  const toggle=document.querySelector('.nav-toggle');
  const html=document.documentElement;
  toggle?.addEventListener('click',()=>{
    const isOpen=html.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded',isOpen);
  });

  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.addEventListener('click',()=>html.classList.remove('nav-open'));
  });

  // --- Scroll reveal ---
  if(window.matchMedia('(prefers-reduced-motion:no-preference)').matches){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}
      });
    },{threshold:.1});
    document.querySelectorAll('.rv').forEach(el=>obs.observe(el));
  }else{
    document.querySelectorAll('.rv').forEach(el=>el.classList.add('vis'));
  }

  // --- Animated stat counters ---
  (function(){
    const nums=document.querySelectorAll('.hero-stat .num');
    if(!nums.length||!window.IntersectionObserver)return;
    const animated=new Set();
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting||animated.has(e.target))return;
        animated.add(e.target);obs.unobserve(e.target);
        const el=e.target;
        const target=parseInt(el.textContent.trim(),10);
        if(isNaN(target))return;
        const start=performance.now();
        const dur=1200;
        el.textContent='0';
        function tick(now){
          const t=Math.min((now-start)/dur,1);
          const v=t===1?1:1-Math.pow(2,-10*t);
          el.textContent=Math.round(v*target);
          if(t<1)requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },{threshold:.4});
    nums.forEach(n=>obs.observe(n));
  })();

  // --- Contact form validation ---
  const form=document.getElementById('order-form');
  if(form){
    const fields={
      name:{label:'Full name'},
      email:{label:'Email address'},
      message:{label:'Order details'}
    };
    Object.keys(fields).forEach(id=>{
      const input=form.querySelector(`#${id}`);
      const err=document.createElement('span');
      err.className='form-error';
      err.id=`${id}-error`;
      input?.parentNode?.insertBefore(err,input.nextSibling);
    });
    form.addEventListener('submit',e=>{
      let valid=true;
      Object.keys(fields).forEach(id=>{
        const input=form.querySelector(`#${id}`);
        const err=document.getElementById(`${id}-error`);
        if(!input||!err)return;
        const val=input.value.trim();
        if(!val){
          err.textContent=`Please enter your ${fields[id].label.toLowerCase()}`;
          input.style.borderColor='#c00';
          valid=false;
        }else if(id==='email'&&!/^\S+@\S+\.\S+$/.test(val)){
          err.textContent='Please enter a valid email address';
          input.style.borderColor='#c00';
          valid=false;
        }else{
          err.textContent='';
          input.style.borderColor='';
        }
      });
      if(!valid)e.preventDefault();
    });
    form.querySelectorAll('input,textarea,select').forEach(el=>{
      el.addEventListener('input',()=>{
        el.style.borderColor='';
        const err=document.getElementById(`${el.id}-error`);
        if(err)err.textContent='';
      });
    });
  }

});
