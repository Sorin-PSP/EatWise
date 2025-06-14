import { Link } from 'react-router-dom'
import { FaUtensils, FaChartBar, FaCalendarAlt, FaUser, FaSignInAlt } from 'react-icons/fa'
import { useUser } from '../contexts/UserContext'

function HomePage() {
  const { user } = useUser()
  
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white p-6 mb-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M42.8,-65.2C54.9,-56.3,63.7,-42.8,69.2,-28.1C74.8,-13.4,77.2,2.5,73.2,16.8C69.3,31.1,59,43.8,46.4,53.9C33.8,64,18.9,71.5,2.4,69.8C-14.1,68.1,-32.2,57.2,-45.8,44.3C-59.5,31.3,-68.7,16.2,-70.8,-0.2C-72.9,-16.6,-67.8,-34.5,-56.6,-44.8C-45.4,-55.1,-28.1,-57.8,-12.8,-58.7C2.5,-59.6,16.8,-58.7,29.9,-56.5C43,-54.3,54.9,-50.8,42.8,-65.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 relative z-10">Bine ai venit la EatWise!</h1>
        <p className="mb-4 relative z-10">Aplicația ta personală pentru calculul și urmărirea caloriilor.</p>
        
        {user.isLoggedIn ? (
          <p className="relative z-10">Salut, <strong>{user.name}</strong>! Obiectivul tău zilnic este de <strong>{user.dailyCalorieGoal} calorii</strong>.</p>
        ) : (
          <Link to="/login" className="btn bg-white text-primary hover:bg-gray-100 inline-block relative z-10">
            Conectează-te pentru a începe
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {user.isLoggedIn ? (
          <>
            <Link to="/dashboard" className="card hover:shadow-lg transition-shadow flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-primary-light bg-opacity-20 p-3 rounded-full mr-4 relative z-10">
                <FaChartBar className="text-primary text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <p className="text-gray-600">Vizualizează progresul și statisticile tale</p>
              </div>
            </Link>
            
            <Link to="/food-database" className="card hover:shadow-lg transition-shadow flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-secondary-light bg-opacity-20 p-3 rounded-full mr-4 relative z-10">
                <FaUtensils className="text-secondary text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Bază de Date Alimente</h2>
                <p className="text-gray-600">Caută și adaugă alimente în jurnalul tău</p>
              </div>
            </Link>
            
            <Link to="/meal-planner" className="card hover:shadow-lg transition-shadow flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-blue-100 p-3 rounded-full mr-4 relative z-10">
                <FaCalendarAlt className="text-blue-500 text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Planificator Mese</h2>
                <p className="text-gray-600">Planifică-ți mesele și urmărește nutrienții</p>
              </div>
            </Link>
            
            <Link to="/profile" className="card hover:shadow-lg transition-shadow flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-purple-100 p-3 rounded-full mr-4 relative z-10">
                <FaUser className="text-purple-500 text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Profil</h2>
                <p className="text-gray-600">Actualizează-ți datele și obiectivele</p>
              </div>
            </Link>
          </>
        ) : (
          <>
            <div className="card flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-primary-light bg-opacity-20 p-3 rounded-full mr-4 relative z-10">
                <FaChartBar className="text-primary text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Dashboard personalizat</h2>
                <p className="text-gray-600">Urmărește progresul și statisticile tale zilnice</p>
              </div>
            </div>
            
            <div className="card flex items-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-secondary-light bg-opacity-20 p-3 rounded-full mr-4 relative z-10">
                <FaUtensils className="text-secondary text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Bază de date completă</h2>
                <p className="text-gray-600">Acces la mii de alimente cu informații nutriționale</p>
              </div>
            </div>
            
            <Link to="/login" className="card hover:shadow-lg transition-shadow flex items-center p-6 relative overflow-hidden group col-span-1 md:col-span-2">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300" 
                  style={{backgroundImage: "url('https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
              <div className="bg-secondary bg-opacity-20 p-3 rounded-full mr-4 relative z-10">
                <FaSignInAlt className="text-secondary text-xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">Conectează-te pentru a accesa toate funcționalitățile</h2>
                <p className="text-gray-600">Creează un cont gratuit sau conectează-te pentru a începe</p>
              </div>
            </Link>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center opacity-20 rounded-r-xl" 
               style={{backgroundImage: "url('https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
          <h2 className="text-xl font-semibold mb-4 relative z-10">Despre EatWise</h2>
          <p className="mb-3 relative z-10">
            EatWise este aplicația ta personală pentru calculul și urmărirea caloriilor. Cu EatWise, poți:
          </p>
          <ul className="list-disc pl-5 mb-3 space-y-1 relative z-10">
            <li>Urmări aportul zilnic de calorii și nutrienți</li>
            <li>Accesa o bază de date cu alimente și valorile lor nutriționale</li>
            <li>Planifica mesele în avans</li>
            <li>Vizualiza statistici și progresul tău</li>
            <li>Seta obiective personalizate de nutriție</li>
          </ul>
          <p className="relative z-10">
            EatWise funcționează și offline, astfel încât să poți urmări alimentația ta oriunde te-ai afla!
          </p>
        </div>
        
        <div className="card flex flex-col justify-between">
          <div className="rounded-lg overflow-hidden mb-4 h-40">
            <img 
              src="https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy lifestyle" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">Inspirație zilnică</h3>
            <p className="text-gray-600 text-sm">
              "Alimentația sănătoasă nu înseamnă restricții severe, ci înseamnă să te simți minunat, să ai mai multă energie și să-ți stabilizezi starea de spirit."
            </p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Galerie de inspirație</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy breakfast" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Fresh vegetables" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Fitness activity" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy meal prep" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
