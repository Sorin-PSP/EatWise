import { supabase } from './src/lib/supabaseClient.js';

async function checkAdminConnection() {
  try {
    console.log('🔍 Verificare conexiune Supabase...');
    
    // 1. Verifică configurația clientului
    console.log('📋 Configurație client:');
    console.log('URL:', supabase.supabaseUrl);
    console.log('Key type:', supabase.supabaseKey?.substring(0, 20) + '...');
    
    // 2. Testează conexiunea de bază
    const { data: testData, error: testError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Eroare la testarea conexiunii:', testError.message);
      return;
    }
    
    // 3. Verifică sesiunea curentă
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Eroare la verificarea sesiunii:', sessionError.message);
      return;
    }
    
    console.log('\n📊 Status conexiune:');
    if (session) {
      console.log('✅ Sesiune activă găsită');
      console.log('👤 Email utilizator:', session.user.email);
      console.log('🔑 User ID:', session.user.id);
      console.log('⏰ Expiră la:', new Date(session.expires_at * 1000).toLocaleString());
      
      // Verifică dacă este admin
      const isAdmin = session.user.email === 'admineatwise@gmail.com';
      console.log('👑 Este admin:', isAdmin ? '✅ DA' : '❌ NU');
      
      if (isAdmin) {
        console.log('\n🎯 CONEXIUNE ADMIN CONFIRMATĂ');
      } else {
        console.log('\n⚠️  Conectat ca utilizator obișnuit');
      }
    } else {
      console.log('❌ Nicio sesiune activă');
      console.log('📝 Aplicația folosește doar cheia anonimă');
    }
    
    // 4. Testează permisiunile admin
    console.log('\n🔐 Testare permisiuni admin...');
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('auth.users')
        .select('email, created_at')
        .limit(5);
        
      if (usersError) {
        console.log('❌ Nu pot accesa tabelul auth.users:', usersError.message);
        console.log('📋 Folosind doar cheia anonimă - acces limitat');
      } else {
        console.log('✅ Acces la tabelul auth.users - permisiuni extinse');
        console.log('👥 Utilizatori găsiți:', usersData?.length || 0);
      }
    } catch (adminError) {
      console.log('❌ Eroare la testarea permisiunilor admin:', adminError.message);
    }
    
  } catch (error) {
    console.error('💥 Eroare generală:', error);
  }
}

// Rulează verificarea
checkAdminConnection();
