import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

// ------------------- Sample Data -------------------
const sampleChallenge = {
  id: 'weightloss-30d',
  title: '30-Day Weight Loss',
  category: 'เมนูลดน้ำหนัก',
  cover: '/images/weightloss-cover.jpg',
  duration: 7, // for demo keep short
  daily_tasks: Array.from({ length: 7 }).map((_, i) => ({
    day: i + 1,
    task:
      i % 2 === 0
        ? `ดื่มน้ำ 2 ลิตร + คาร์ดิโอ 30 นาที (Day ${i + 1})`
        : `อาหารคลีน 3 มื้อ + เวทเทรนนิ่ง (Day ${i + 1})`,
    image: '/images/task-' + ((i % 3) + 1) + '.jpg',
  })),
}

const categoryColor = {
  'เมนูลดน้ำหนัก': '#16a34a',
  'เมนูอาหารคลีน': '#0ea5e9',
  'เมนูการออกกำลังกาย': '#ef4444',
  'เมนูอาหารเสริม': '#a78bfa',
  'เมนูดูแลผิว': '#f59e0b',
  'เมนูเพิ่มสมาธิ': '#06b6d4',
  'เมนูอ่านหนังสือ': '#6366f1',
}

// ------------------- Helper Utilities -------------------
function formatISODate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatISODateTime(d) {
  // yyyy-mm-ddThh:mm
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

// ------------------- Challenge Page -------------------
function ChallengePage({ challenge = sampleChallenge }) {
  const [completedDays, setCompletedDays] = useState(new Set())
  const [comments, setComments] = useState([
    { id: 1, user: 'Nut', text: 'เริ่มวันนี้เลยครับ!' },
    { id: 2, user: 'May', text: 'ชอบเมนูวันที่ 2 มากๆ' },
  ])
  const [commentText, setCommentText] = useState('')

  const toggleDay = (day) => {
    setCompletedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const addComment = () => {
    if (!commentText.trim()) return
    setComments((c) => [
      ...c,
      { id: Date.now(), user: 'You', text: commentText.trim() },
    ])
    setCommentText('')
  }

  const progress = Math.round((completedDays.size / challenge.duration) * 100)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <img src={challenge.cover} alt="cover" className="w-28 h-20 rounded object-cover shadow"/>
        <div>
          <h2 className="text-2xl font-bold">{challenge.title}</h2>
          <div className="text-sm text-gray-500">หมวด: {challenge.category}</div>
          <div className="mt-2 text-sm">Progress: <span className="font-semibold">{progress}%</span> • Streak: <span className="font-semibold">{completedDays.size}</span> วัน</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Accordion list of days */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h3 className="font-semibold mb-3">รายละเอียดกิจกรรมรายวัน</h3>
            <div className="space-y-3">
              {challenge.daily_tasks.map((d) => (
                <div key={d.day} className="border rounded-lg">
                  <details>
                    <summary className="flex items-center justify-between p-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`} style={{background: categoryColor[challenge.category]||'#777'}}>{d.day}</div>
                        <div>
                          <div className="font-medium">Day {d.day}</div>
                          <div className="text-xs text-gray-500">{d.task}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className={`px-3 py-1 rounded ${completedDays.has(d.day) ? 'bg-green-600 text-white' : 'border'}`}
                          onClick={(e) => { e.preventDefault(); toggleDay(d.day); }}
                        >
                          {completedDays.has(d.day) ? '✔ สำเร็จ' : 'ทำสำเร็จ'}
                        </button>
                        <div className="text-xs text-gray-400">{completedDays.has(d.day) ? 'Completed' : 'Not yet'}</div>
                      </div>
                    </summary>

                    <div className="p-4 border-t">
                      <img src={d.image} alt={`day-${d.day}`} className="w-full h-40 object-cover rounded mb-3" />
                      <p className="text-sm text-gray-600">คำอธิบายเพิ่มเติมสำหรับกิจกรรมวัน {d.day}. ทำซ้ำหรือปรับตามระดับความฟิตของคุณ</p>
                      <div className="mt-3 flex gap-3">
                        <button className="px-3 py-2 bg-blue-600 text-white rounded">บันทึกประสบการณ์</button>
                        <button className="px-3 py-2 border rounded">แชร์ในชุมชน</button>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {/* Comments mock */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h3 className="font-semibold mb-3">ความคิดเห็น / ให้กำลังใจ</h3>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{c.user}</div>
                    <div className="text-xs text-gray-400">just now</div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{c.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="เขียนความคิดเห็น..." className="flex-1 border rounded p-2" />
              <button onClick={addComment} className="px-4 py-2 bg-green-600 text-white rounded">ส่ง</button>
            </div>
          </div>

        </div>

        <aside className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h4 className="font-semibold">สถิติ</h4>
            <div className="mt-3">
              <div className="text-sm text-gray-500">ความคืบหน้า</div>
              <div className="text-2xl font-bold">{progress}%</div>
            </div>
            <div className="mt-3 text-sm text-gray-500">Badges</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded">🔥 3-Day Streak</div>
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">🏅 First Challenge</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h4 className="font-semibold">แชร์</h4>
            <div className="mt-3 flex flex-col gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded">แชร์ไปที่ Facebook</button>
              <button className="px-3 py-2 bg-sky-500 text-white rounded">แชร์ไปที่ LINE</button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

// ------------------- Calendar Page -------------------
function CalendarPage({ initialEvents }) {
  const calendarRef = useRef(null)
  const [events, setEvents] = useState(initialEvents)
  const [editingEvent, setEditingEvent] = useState(null)

  // Initialize external draggable sidebar
  useEffect(() => {
    let draggableEl = document.getElementById('external-events')
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData(eventEl) {
          return {
            title: eventEl.innerText,
            color: eventEl.getAttribute('data-color'),
            id: String(Date.now()),
          }
        },
      })
    }
  }, [])

  // Event drop inside calendar
  const handleEventDrop = (info) => {
    const updated = events.map((ev) =>
      ev.id === info.event.id
        ? { ...ev, start: formatISODate(info.event.start) }
        : ev
    )
    setEvents(updated)
  }

  // Remove event by id
  const removeEvent = (id) => {
    setEvents((evs) => evs.filter((ev) => ev.id !== id))
    setEditingEvent(null)
  }

  // Open edit popup for event
  const openEdit = (clickInfo) => {
    setEditingEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: formatISODateTime(clickInfo.event.start),
      color: clickInfo.event.backgroundColor || '#6366f1',
    })
  }

  // Save edit changes
  const saveEdit = () => {
    setEvents((evs) =>
      evs.map((ev) =>
        ev.id === editingEvent.id
          ? { ...ev, title: editingEvent.title, start: editingEvent.start, color: editingEvent.color }
          : ev
      )
    )
    setEditingEvent(null)
  }

  // Add event on date click
  const handleDateClick = (arg) => {
    const title = prompt('ชื่อกิจกรรมใหม่สำหรับวัน ' + arg.dateStr)
    if (title) {
      const newEv = {
        id: String(Date.now()),
        title,
        start: arg.dateStr,
        color: '#6366f1',
      }
      setEvents((e) => [...e, newEv])
    }
  }

  // Drop external event from sidebar → add to calendar and remove from sidebar
  const handleEventReceive = (info) => {
    // Remove from sidebar list by id (which we saved on drag)
    const idToRemove = info.draggedEl.getAttribute('data-id')
    if (idToRemove) {
      const sidebarEl = document.getElementById('external-events')
      if (sidebarEl) {
        const childToRemove = Array.from(sidebarEl.children).find(
          (el) => el.getAttribute('data-id') === idToRemove
        )
        if (childToRemove) childToRemove.remove()
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">ปฏิทินของฉัน</h2>
      <div className="flex gap-6">
        {/* Sidebar for external draggable events */}
        <div
          id="external-events"
          className="w-48 p-3 bg-white dark:bg-gray-800 rounded-lg shadow space-y-2"
        >
          <h3 className="font-semibold mb-2">ลากกิจกรรมไปปฏิทิน</h3>
          {Object.entries(categoryColor).map(([cat, col]) => (
            <div
              key={cat}
              className="fc-event px-3 py-2 rounded cursor-pointer text-white select-none"
              style={{ backgroundColor: col }}
              data-color={col}
              data-id={cat}
            >
              {cat}
            </div>
          ))}
          <div className="text-xs mt-4 italic text-gray-500">
            ลากกิจกรรมแล้วจะหายจากตรงนี้ด้วย
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            editable={true}
            selectable={true}
            droppable={true}
            events={events}
            ref={calendarRef}
            eventDrop={handleEventDrop}
            dateClick={handleDateClick}
            eventClick={openEdit}
            eventReceive={handleEventReceive}
            eventDisplay="block"
            height={650}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-2">Legend (สีแยกตามหมวด)</h3>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(categoryColor).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <div style={{ background: v }} className="w-6 h-6 rounded-full" />
              <div className="text-sm">{k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Event Popup */}
      {editingEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setEditingEvent(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">แก้ไขกิจกรรม</h3>

            <label className="block mb-2 font-medium">
              ชื่อกิจกรรม
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>

            <label className="block mb-2 font-medium">
              วันที่และเวลาเริ่มต้น
              <input
                type="datetime-local"
                value={editingEvent.start}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, start: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>

            <label className="block mb-4 font-medium">
              สีหมวดหมู่
              <input
                type="color"
                value={editingEvent.color}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, color: e.target.value })
                }
                className="w-16 h-10 p-0 border rounded mt-1"
              />
            </label>

            <div className="flex justify-between">
              <button
                onClick={() => removeEvent(editingEvent.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                ลบกิจกรรม
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ------------------- Main App -------------------
export default function App() {
  const today = new Date()
  const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const events = sampleChallenge.daily_tasks.map((d, i) => {
    const dt = new Date(baseDate)
    dt.setDate(baseDate.getDate() + i)
    return {
      id: `${sampleChallenge.id}-${d.day}`,
      title: `${sampleChallenge.title} - Day ${d.day}`,
      start: formatISODate(dt),
      color: categoryColor[sampleChallenge.category] || '#6b7280',
    }
  })

  const [route, setRoute] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold">HB</div>
          <h1 className="text-xl font-semibold">Health Challenge Blocker</h1>
        </div>
        <nav className="flex gap-3">
          <button className={`px-3 py-2 rounded ${route==='home'?'bg-gray-200 dark:bg-gray-700':''}`} onClick={()=>setRoute('home')}>หน้าแรก</button>
          <button className={`px-3 py-2 rounded ${route==='challenge'?'bg-gray-200 dark:bg-gray-700':''}`} onClick={()=>setRoute('challenge')}>Challenge</button>
          <button className={`px-3 py-2 rounded ${route==='calendar'?'bg-gray-200 dark:bg-gray-700':''}`} onClick={()=>setRoute('calendar')}>ปฏิทิน</button>
        </nav>
      </header>

      <main>
        {route === 'home' && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="rounded-2xl p-8 bg-white dark:bg-gray-800 shadow">
              <h2 className="text-2xl font-bold">เริ่มต้นวันใหม่ด้วยความท้าทาย!</h2>
              <p className="mt-2 text-sm text-gray-500">เลือก Challenge หรือออกแบบของคุณเอง — ทดลองคลิกที่เมนู Challenge เพื่อดูรายละเอียด</p>
            </div>
          </div>
        )}

        {route === 'challenge' && <ChallengePage challenge={sampleChallenge} />}

        {route === 'calendar' && <CalendarPage initialEvents={events} />}
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Health Challenge Blocker</footer>
    </div>
  )
}
