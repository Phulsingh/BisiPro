import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
    groupService,
    type CreateGroupRequest,
} from "@/services/groupService"
import { BisiType } from "@/enums/enum"
import {
    Users,
    CalendarDays,
    BadgeDollarSign,
    Clock,
    ShieldAlert,
    ChevronDown,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
    groupName: string
    description: string
    bisiType: string            // kept as string for the select element
    monthlyAmount: string
    totalMembers: string
    durationInMonths: string
    startDate: string
    collectionDay: string
    auctionDay: string
    lateFee: string
    gracePeriod: string
}

interface FormErrors {
    [key: string]: string | undefined
}

const INITIAL_FORM: FormState = {
    groupName: "",
    description: "",
    bisiType: String(BisiType.FixedRotation),
    monthlyAmount: "",
    totalMembers: "",
    durationInMonths: "",
    startDate: "",
    collectionDay: "",
    auctionDay: "",
    lateFee: "",
    gracePeriod: "",
}

// ── Validation ─────────────────────────────────────────────────────────────────
function validate(form: FormState): FormErrors {
    const errors: FormErrors = {}

    if (!form.groupName.trim())
        errors.groupName = "Group name is required."
    else if (form.groupName.trim().length < 3)
        errors.groupName = "Group name must be at least 3 characters."

    const type = Number(form.bisiType) as BisiType
    if (!Object.values(BisiType).includes(type))
        errors.bisiType = "Please select a valid group type."

    const amount = Number(form.monthlyAmount)
    if (!form.monthlyAmount || isNaN(amount) || amount <= 0)
        errors.monthlyAmount = "Monthly amount must be greater than 0."

    const members = Number(form.totalMembers)
    if (!form.totalMembers || isNaN(members) || members < 2)
        errors.totalMembers = "There must be at least 2 members."

    const duration = Number(form.durationInMonths)
    if (!form.durationInMonths || isNaN(duration) || duration < 1)
        errors.durationInMonths = "Duration must be at least 1 month."

    if (!form.startDate)
        errors.startDate = "Start date is required."

    const collDay = Number(form.collectionDay)
    if (!form.collectionDay || isNaN(collDay) || collDay < 1 || collDay > 31)
        errors.collectionDay = "Collection day must be between 1 and 31."

    if (type === BisiType.Auction) {
        const auctDay = Number(form.auctionDay)
        if (!form.auctionDay || isNaN(auctDay) || auctDay < 1 || auctDay > 31)
            errors.auctionDay = "Auction day must be between 1 and 31."
    }

    const lateFee = Number(form.lateFee)
    if (form.lateFee !== "" && (isNaN(lateFee) || lateFee < 0))
        errors.lateFee = "Late fee cannot be negative."

    const grace = Number(form.gracePeriod)
    if (form.gracePeriod !== "" && (isNaN(grace) || grace < 0))
        errors.gracePeriod = "Grace period cannot be negative."

    return errors
}

// ── Group type config ──────────────────────────────────────────────────────────
const bisiTypeOptions = [
    { value: BisiType.FixedRotation, label: "🔄 Fixed Rotation", description: "Members take turns in a fixed order" },
    { value: BisiType.Auction, label: "🔨 Auction", description: "Members bid to receive the pot" },
    { value: BisiType.LuckyDraw, label: "🎫 Lucky Draw", description: "Random draw selects the recipient" },
    { value: BisiType.ManualSelection, label: "👤 Manual Selection", description: "Admin manually picks the recipient" },
]

// ── Field helpers ──────────────────────────────────────────────────────────────
function FormField({
    label,
    required,
    error,
    children,
}: {
    label: string
    required?: boolean
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#29463f] tracking-wide uppercase">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <AlertCircle className="size-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    )
}

const inputClass = (error?: string) =>
    cn(
        "h-10 w-full rounded-xl border bg-[#f5f7f3]/50 px-3 text-sm text-[#183630] outline-none transition-colors placeholder:text-[#94a39d]",
        "focus:border-[#078a76] focus:ring-2 focus:ring-[#078a76]/20 focus:bg-white",
        error
            ? "border-red-400 ring-2 ring-red-200"
            : "border-[#cedbd3] hover:border-[#b9e4d8]"
    )

// ── Main Component ─────────────────────────────────────────────────────────────
export function CreateGroupDialog({
    open,
    onOpenChange,
    onSuccess,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const isAuction = Number(form.bisiType) === BisiType.Auction

    const set = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
        if (serverError) setServerError(null)
        if (success) setSuccess(false)
    }

    const handleClose = (nextOpen: boolean) => {
        if (!submitting) {
            onOpenChange(nextOpen)
            if (!nextOpen) {
                // Reset after close animation
                setTimeout(() => {
                    setForm(INITIAL_FORM)
                    setErrors({})
                    setServerError(null)
                    setSuccess(false)
                }, 200)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setServerError(null)

        const validationErrors = validate(form)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const body: CreateGroupRequest = {
            groupName: form.groupName.trim(),
            description: form.description.trim(),
            bisiType: Number(form.bisiType) as BisiType,
            monthlyAmount: Number(form.monthlyAmount),
            totalMembers: Number(form.totalMembers),
            durationInMonths: Number(form.durationInMonths),
            startDate: form.startDate,
            collectionDay: Number(form.collectionDay),
            auctionDay: isAuction ? Number(form.auctionDay) : null,
            lateFee: form.lateFee !== "" ? Number(form.lateFee) : 0,
            gracePeriod: form.gracePeriod !== "" ? Number(form.gracePeriod) : 0,
        }

        try {
            setSubmitting(true)
            const response = await groupService.createGroup(body)

            if (response?.isSuccess) {
                setSuccess(true)
                onSuccess?.()
                // Auto-close after short success flash
                setTimeout(() => handleClose(false), 1200)
            } else {
                setServerError(response?.error || "Failed to create the group. Please try again.")
            }
        } catch (err: any) {
            setServerError(err?.message || "An unexpected error occurred.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="max-w-7xl w-full p-0 gap-0 overflow-hidden rounded-2xl border border-[#cedbd3] shadow-xl"
                showCloseButton={!submitting}
            >
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#d9e2dc] bg-gradient-to-r from-[#f5f7f3] to-white">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#078a76]/10 flex items-center justify-center shrink-0">
                            <Users className="size-5 text-[#078a76]" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-[#183630] leading-tight">
                                Create New Group
                            </DialogTitle>
                            <p className="text-xs text-[#788b83] mt-0.5">
                                Fill in the details to set up a new savings group.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-5">

                        {/* ── Basic Info ── */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#078a76] flex items-center gap-2">
                                <span className="inline-block w-4 h-px bg-[#078a76]/40" />
                                Basic Information
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <FormField label="Group Name" required error={errors.groupName}>
                                        <Input
                                            id="groupName"
                                            placeholder="e.g., Family Savings Circle"
                                            className={inputClass(errors.groupName)}
                                            value={form.groupName}
                                            onChange={set("groupName")}
                                            disabled={submitting}
                                            maxLength={100}
                                        />
                                    </FormField>
                                </div>

                                <div className="sm:col-span-2">
                                    <FormField label="Description" error={errors.description}>
                                        <Textarea
                                            id="description"
                                            placeholder="Brief description of the group's purpose..."
                                            className={cn(
                                                "min-h-[72px] rounded-xl border border-[#cedbd3] bg-[#f5f7f3]/50 px-3 py-2.5 text-sm text-[#183630] placeholder:text-[#94a39d] outline-none transition-colors resize-none",
                                                "focus:border-[#078a76] focus:ring-2 focus:ring-[#078a76]/20 focus:bg-white hover:border-[#b9e4d8]"
                                            )}
                                            value={form.description}
                                            onChange={set("description")}
                                            disabled={submitting}
                                            maxLength={300}
                                        />
                                    </FormField>
                                </div>

                                {/* Group Type */}
                                <div className="sm:col-span-2">
                                    <FormField label="Group Type" required error={errors.bisiType}>
                                        <div className="relative">
                                            <select
                                                id="bisiType"
                                                className={cn(inputClass(errors.bisiType), "appearance-none pr-9 cursor-pointer")}
                                                value={form.bisiType}
                                                onChange={set("bisiType")}
                                                disabled={submitting}
                                            >
                                                {bisiTypeOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-3 size-4 text-[#788b83] pointer-events-none" />
                                        </div>
                                        {/* Type description hint */}
                                        <p className="text-xs text-[#788b83] mt-0.5">
                                            {bisiTypeOptions.find((o) => String(o.value) === form.bisiType)?.description}
                                        </p>
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* ── Financial Settings ── */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#078a76] flex items-center gap-2">
                                <BadgeDollarSign className="size-3.5" />
                                Financial Settings
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="Monthly Amount (Rs)" required error={errors.monthlyAmount}>
                                    <Input
                                        id="monthlyAmount"
                                        type="number"
                                        min={1}
                                        placeholder="5000"
                                        className={inputClass(errors.monthlyAmount)}
                                        value={form.monthlyAmount}
                                        onChange={set("monthlyAmount")}
                                        disabled={submitting}
                                    />
                                </FormField>

                                <FormField label="Late Fee (Rs)" error={errors.lateFee}>
                                    <Input
                                        id="lateFee"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        className={inputClass(errors.lateFee)}
                                        value={form.lateFee}
                                        onChange={set("lateFee")}
                                        disabled={submitting}
                                    />
                                </FormField>

                                <FormField label="Grace Period (days)" error={errors.gracePeriod}>
                                    <Input
                                        id="gracePeriod"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        className={inputClass(errors.gracePeriod)}
                                        value={form.gracePeriod}
                                        onChange={set("gracePeriod")}
                                        disabled={submitting}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* ── Group Structure ── */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#078a76] flex items-center gap-2">
                                <Clock className="size-3.5" />
                                Group Structure
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Total Members" required error={errors.totalMembers}>
                                    <Input
                                        id="totalMembers"
                                        type="number"
                                        min={2}
                                        placeholder="10"
                                        className={inputClass(errors.totalMembers)}
                                        value={form.totalMembers}
                                        onChange={set("totalMembers")}
                                        disabled={submitting}
                                    />
                                </FormField>

                                <FormField label="Duration (months)" required error={errors.durationInMonths}>
                                    <Input
                                        id="durationInMonths"
                                        type="number"
                                        min={1}
                                        placeholder="12"
                                        className={inputClass(errors.durationInMonths)}
                                        value={form.durationInMonths}
                                        onChange={set("durationInMonths")}
                                        disabled={submitting}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* ── Schedule ── */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#078a76] flex items-center gap-2">
                                <CalendarDays className="size-3.5" />
                                Schedule
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="Start Date" required error={errors.startDate}>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        className={inputClass(errors.startDate)}
                                        value={form.startDate}
                                        onChange={set("startDate")}
                                        disabled={submitting}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </FormField>

                                <FormField label="Collection Day" required error={errors.collectionDay}>
                                    <Input
                                        id="collectionDay"
                                        type="number"
                                        min={1}
                                        max={31}
                                        placeholder="1–31"
                                        className={inputClass(errors.collectionDay)}
                                        value={form.collectionDay}
                                        onChange={set("collectionDay")}
                                        disabled={submitting}
                                    />
                                </FormField>

                                {/* Auction Day — only visible for Auction type */}
                                {isAuction && (
                                    <FormField label="Auction Day" required error={errors.auctionDay}>
                                        <Input
                                            id="auctionDay"
                                            type="number"
                                            min={1}
                                            max={31}
                                            placeholder="1–31"
                                            className={inputClass(errors.auctionDay)}
                                            value={form.auctionDay}
                                            onChange={set("auctionDay")}
                                            disabled={submitting}
                                        />
                                    </FormField>
                                )}
                            </div>
                        </div>

                        {/* Server error banner */}
                        {serverError && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        {/* Success banner */}
                        {success && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-[#c3e4ba] bg-[#e2f1df] px-4 py-3 text-sm font-semibold text-[#056c5c]">
                                <CheckCircle2 className="size-4 shrink-0" />
                                Group created successfully!
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="px-6 py-4 border-t border-[#d9e2dc] bg-[#f5f7f3]/50 flex-row justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                            disabled={submitting}
                            className="cursor-pointer rounded-xl border-[#cedbd3] text-[#29463f] hover:bg-[#edf3ee]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting || success}
                            className="cursor-pointer rounded-xl bg-[#078a76] text-white font-semibold hover:bg-[#056c5c] px-6 gap-2 shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating…
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="size-4" />
                                    Created!
                                </>
                            ) : (
                                "Create Group"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}