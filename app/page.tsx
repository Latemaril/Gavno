"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Activity } from "lucide-react"
import PatientForm from "@/components/patient-form"
import Questionnaire from "@/components/questionnaire"

export default function HomePage() {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null)
  const [patientData, setPatientData] = useState<any>(null)
  const [skipPatientForm, setSkipPatientForm] = useState(false)

  const questionnaires = [
    {
      id: "bone-stops",
      title: "Переломы костей стопы",
      description: "Диагностика переломов костей стопы (кроме пяточной кости)",
      file: "/bone-stops.json",
    },
    {
      id: "ankle",
      title: "Переломы лодыжек",
      description: "Система поддержки при переломах лодыжек",
      file: "/ankle.json",
    },
    {
      id: "heel-fracture",
      title: "Переломы пяточной кости",
      description: "Диагностика и лечение переломов пяточной кости",
      file: "/heel-fracture.json",
    },
    {
      id: "femur-fracture",
      title: "Переломы проксимального отдела бедра",
      description: "Травмы шейки бедра и вертикальные переломы",
      file: "/femur-fracture.json",
    },
  ]

  const handleStartQuestionnaire = (questionnaireId: string) => {
    setSelectedQuestionnaire(questionnaireId)
  }

  const handlePatientDataSubmit = (data: any) => {
    setPatientData(data)
  }

  const handleSkipPatientForm = () => {
    setSkipPatientForm(true)
    setPatientData({
      gender: "not_specified",
      age: 0,
      weight: 0,
      chronicDiseases: "",
    })
  }

  const handleBackToHome = () => {
    setSelectedQuestionnaire(null)
    setPatientData(null)
    setSkipPatientForm(false)
  }

  if (selectedQuestionnaire && patientData) {
    const questionnaire = questionnaires.find((q) => q.id === selectedQuestionnaire)
    return (
      <Questionnaire
        questionnaireFile={questionnaire!.file}
        questionnaireTitle={questionnaire!.title}
        patientData={patientData}
        onBackToHome={handleBackToHome}
      />
    )
  }

  if (selectedQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button variant="outline" onClick={() => setSelectedQuestionnaire(null)} className="mb-6">
            ← Назад к выбору опросника
          </Button>
          <PatientForm onSubmit={handlePatientDataSubmit} onSkip={handleSkipPatientForm} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Activity className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Медицинская Диагностическая Система</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Интерактивная система поддержки принятия клинических решений для врачей-травматологов
          </p>
        </div>

        {/* Questionnaire Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questionnaires.map((q) => (
            <Card
              key={q.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-400"
              onClick={() => handleStartQuestionnaire(q.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{q.title}</CardTitle>
                    <CardDescription className="text-sm">{q.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="default">
                  Начать диагностику →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Важная информация</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Система создана на основе клинических рекомендаций АТОР 2024-2025</li>
            <li>• Все действия и рекомендации сохраняются в лог-файл</li>
            <li>• Вы можете вернуться на предыдущий шаг в любой момент</li>
            <li>• Результаты можно экспортировать после завершения опроса</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
