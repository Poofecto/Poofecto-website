(()=>{
 const menu=document.getElementById('menuButton'),links=document.getElementById('navLinks');
 menu?.addEventListener('click',()=>{let open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')});
 links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
 document.getElementById('year').textContent=String(new Date().getFullYear());
 const prices={1:20,2:25,3:28,4:32};let dogs=1;
 const visits=document.getElementById('visits');
 const update=()=>{document.getElementById('perVisit').textContent=`$${prices[dogs]}`;document.getElementById('perMonth').textContent=`$${prices[dogs]*Number(visits.value)}`;
 const formDogs=document.getElementById('dogs');if(formDogs)formDogs.value=String(dogs)};
 document.querySelectorAll('.dog-choice').forEach(b=>b.addEventListener('click',()=>{dogs=Number(b.dataset.dogs);document.querySelectorAll('.dog-choice').forEach(x=>{let chosen=x===b;x.classList.toggle('selected',chosen);x.setAttribute('aria-pressed',String(chosen))});update()}));
 visits?.addEventListener('change',update);update();
 const form=document.getElementById('quoteForm');
 form?.addEventListener('submit',()=>{const status=document.getElementById('formStatus');status.textContent='Submitting securely through our form provider. Please complete any confirmation step shown.'});
})();
