"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PatientFormProps {
  onSubmit: (data: PatientData) => void
  onSkip?: () => void
}

export interface PatientData {
  gender: string
  age: number
  weight: number
  chronicDiseases: string
}

export default function PatientForm({ onSubmit, onSkip }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientData>({
    gender: "male",
    age: 0,
    weight: 0,
    chronicDiseases: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Введите корректный возраст (1-120 лет)"
    }

    if (!formData.weight || formData.weight < 1 || formData.weight > 300) {
      newErrors.weight = "Введите корректный вес (1-300 кг)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Данные пациента</CardTitle>
        <CardDescription>
          Пожалуйста, заполните информацию о пациенте для начала диагностики
          {onSkip && " (можно пропустить, если данные не требуются)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender */}
          <div className="space-y-2">
            <Label>Пол пациента</Label>
            <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Мужской
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Женский
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Возраст (лет)</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="120"
              value={formData.age || ""}
              onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || 0 })}
              placeholder="Введите возраст"
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Вес (кг)</Label>
            <Input
              id="weight"
              type="number"
              min="1"
              max="300"
              value={formData.weight || ""}
              onChange={(e) => setFormData({ ...formData, weight: Number.parseInt(e.target.value) || 0 })}
              placeholder="Введите вес"
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
          </div>

          {/* Chronic Diseases */}
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases">Хронические заболевания</Label>
            <Textarea
              id="chronicDiseases"
              value={formData.chronicDiseases}
              onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
              placeholder="Укажите хронические заболевания пациента (например: сахарный диабет, гипертония, остеопороз)"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Укажите все известные хронические заболевания, аллергии и постоянные медикаменты
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" size="lg">
              Начать опрос →
            </Button>
            {onSkip && (
              <Button type="button" variant="outline" className="w-full bg-transparent" size="lg" onClick={onSkip}>
                Пропустить (данные не актуальны)
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
