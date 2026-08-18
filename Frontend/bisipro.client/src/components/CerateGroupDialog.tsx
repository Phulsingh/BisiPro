import { useMemo, useState } from "react"
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
import { cn, formatCurrency } from "@/lib/utils"
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
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Wallet,
    Check,
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
    { value: BisiType.FixedRotation, icon: "🔄", label: "Fixed Rotation", description: "Members take turns in a fixed order" },
    { value: BisiType.Auction, icon: "🔨", label: "Auction", description: "Members bid to receive the pot" },
    { value: BisiType.LuckyDraw, icon: "🎫", label: "Lucky Draw", description: "Random draw selects the recipient" },
    { value: BisiType.ManualSelection, icon: "👤", label: "Manual Selection", description: "Admin manually picks the recipient" },
]

// ── Field helpers ──────────────────────────────────────────────────────────────
function FormField({
    label,
    required,
    error,
    hint,
    children,
}: {
    label: string
    required?: boolean
    error?: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#29463f]">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error ? (
                <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertCircle className="size-3 shrink-0" />
                    {error}
                </p>
            ) : hint ? (
                <p className="text-xs text-[#94a39d]">{hint}</p>
            ) : null}
        </div>
    )
}

function SectionHeading({
    icon,
    title,
    hint,
}: {
    icon: React.ReactNode
    title: string
    hint?: string
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#078a76]/10 text-[#078a76]">
                {icon}
            </span>
            <div className="min-w-0">
                <h3 className="text-sm font-bold leading-none text-[#183630]">{title}</h3>
                {hint && <p className="mt-1 text-xs text-[#788b83]">{hint}</p>}
            </div>
            <span className="h-px flex-1 bg-gradient-to-r from-[#d9e2dc] to-transparent" />
        </div>
    )
}

const inputClass = (error?: string) =>
    cn(
        "h-11 w-full rounded-xl border bg-[#f8faf8] px-3.5 text-sm text-[#183630] outline-none transition-all placeholder:text-[#a7b4ae]",
        "focus:border-[#078a76] focus:bg-white focus:ring-4 focus:ring-[#078a76]/15",
        error
            ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200/60"
            : "border-[#dbe5df] hover:border-[#b9e4d8]"
    )

// Row inside the left live-summary panel
function SummaryRow({
    label,
    value,
    accent,
}: {
    label: string
    value: string
    accent?: boolean
}) {
    return (
        <div className="flex items-baseline justify-between gap-3 py-2">
            <span className="text-xs text-white/60">{label}</span>
            <span
                className={cn(
                    "truncate text-right text-sm font-semibold",
                    accent ? "text-[#7ff0d6]" : "text-white"
                )}
            >
                {value}
            </span>
        </div>
    )
}

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

    const clearFeedback = () => {
        if (serverError) setServerError(null)
        if (success) setSuccess(false)
    }

    const set = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
        clearFeedback()
    }

    const selectType = (value: BisiType) => {
        if (submitting) return
        setForm((prev) => ({ ...prev, bisiType: String(value) }))
        setErrors((prev) => ({
            ...prev,
            bisiType: undefined,
            ...(value !== BisiType.Auction ? { auctionDay: undefined } : {}),
        }))
        clearFeedback()
    }

    // Live preview numbers shown in the side panel
    const summary = useMemo(() => {
        const amount = Number(form.monthlyAmount)
        const members = Number(form.totalMembers)
        const months = Number(form.durationInMonths)
        const validAmount = form.monthlyAmount !== "" && !isNaN(amount) && amount > 0
        const validMembers = form.totalMembers !== "" && !isNaN(members) && members > 0
        const validMonths = form.durationInMonths !== "" && !isNaN(months) && months > 0

        return {
            monthly: validAmount ? formatCurrency(amount) : "—",
            members: validMembers ? `${members} members` : "—",
            duration: validMonths ? `${months} ${months === 1 ? "month" : "months"}` : "—",
            pot: validAmount && validMembers ? formatCurrency(amount * members) : "—",
            totalValue:
                validAmount && validMembers && validMonths
                    ? formatCurrency(amount * members * months)
                    : "—",
        }
    }, [form.monthlyAmount, form.totalMembers, form.durationInMonths])

    const activeType = bisiTypeOptions.find((o) => String(o.value) === form.bisiType)

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
                className={cn(
                    "flex w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0",
                    "max-h-[92vh] sm:max-w-[860px] lg:max-w-[1060px]",
                    "rounded-2xl border border-[#cedbd3] bg-white shadow-2xl shadow-[#183630]/10"
                )}
                showCloseButton={!submitting}
            >
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row">

                    {/* ── Left brand / live summary panel ── */}
                    <aside className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b3a32] via-[#0d5548] to-[#078a76] p-7 text-white lg:flex lg:w-[320px]">
                        {/* decorative glows */}
                        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-12 size-52 rounded-full bg-[#7ff0d6]/15 blur-3xl" />

                        <div className="relative">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                                <Users className="size-6" />
                            </div>
                            <h2 className="mt-5 text-2xl font-bold leading-tight">
                                Create a new
                                <br />
                                savings group
                            </h2>
                            <p className="mt-2.5 text-sm leading-relaxed text-white/70">
                                Set the contribution, size and schedule. Members can be invited once the
                                group is created.
                            </p>

                            {activeType && (
                                <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-3.5">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <span className="text-base leading-none">{activeType.icon}</span>
                                        {activeType.label}
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                                        {activeType.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Live summary */}
                        <div className="relative mt-8">
                            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                                <Sparkles className="size-3" />
                                Live summary
                            </p>
                            <div className="mt-2 divide-y divide-white/10 border-t border-white/10">
                                <SummaryRow label="Monthly contribution" value={summary.monthly} />
                                <SummaryRow label="Group size" value={summary.members} />
                                <SummaryRow label="Duration" value={summary.duration} />
                                <SummaryRow label="Pot per cycle" value={summary.pot} accent />
                                <SummaryRow label="Total group value" value={summary.totalValue} accent />
                            </div>
                        </div>
                    </aside>

                    {/* ── Right form column ── */}
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                        <DialogHeader className="shrink-0 gap-0 border-b border-[#e4ebe6] bg-white px-6 py-5 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#078a76]/10 lg:hidden">
                                    <Users className="size-5 text-[#078a76]" />
                                </div>
                                <div className="min-w-0">
                                    <DialogTitle className="text-xl font-bold leading-tight text-[#183630]">
                                        Group details
                                    </DialogTitle>
                                    <p className="mt-1 text-sm text-[#788b83]">
                                        Fields marked <span className="text-red-500">*</span> are required.
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8">

                                {/* ── Basic Info ── */}
                                <section className="space-y-4">
                                    <SectionHeading
                                        icon={<Sparkles className="size-4" />}
                                        title="Basic information"
                                        hint="How members will recognise this group"
                                    />

                                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
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

                                        <FormField
                                            label="Description"
                                            error={errors.description}
                                            hint={`${form.description.length}/300 characters`}
                                        >
                                            <Textarea
                                                id="description"
                                                placeholder="Brief description of the group's purpose..."
                                                className={cn(
                                                    "min-h-11 resize-none rounded-xl border border-[#dbe5df] bg-[#f8faf8] px-3.5 py-3 text-sm text-[#183630] outline-none transition-all placeholder:text-[#a7b4ae]",
                                                    "hover:border-[#b9e4d8] focus:border-[#078a76] focus:bg-white focus:ring-4 focus:ring-[#078a76]/15"
                                                )}
                                                rows={1}
                                                value={form.description}
                                                onChange={set("description")}
                                                disabled={submitting}
                                                maxLength={300}
                                            />
                                        </FormField>
                                    </div>
                                </section>

                                {/* ── Group Type ── */}
                                <section className="space-y-4">
                                    <SectionHeading
                                        icon={<Users className="size-4" />}
                                        title="Group type"
                                        hint="Decides how the pot is handed out each cycle"
                                    />

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {bisiTypeOptions.map((opt) => {
                                            const selected = String(opt.value) === form.bisiType
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => selectType(opt.value)}
                                                    disabled={submitting}
                                                    aria-pressed={selected}
                                                    className={cn(
                                                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                                                        selected
                                                            ? "border-[#078a76] bg-[#078a76]/[0.07] ring-4 ring-[#078a76]/10"
                                                            : "border-[#dbe5df] bg-white hover:border-[#b9e4d8] hover:bg-[#f5f7f3]/70"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "flex size-9 shrink-0 items-center justify-center rounded-lg text-lg transition-colors",
                                                            selected ? "bg-white shadow-sm" : "bg-[#f0f4f1]"
                                                        )}
                                                    >
                                                        {opt.icon}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-semibold text-[#183630]">
                                                            {opt.label}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs leading-snug text-[#788b83]">
                                                            {opt.description}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-all",
                                                            selected
                                                                ? "border-[#078a76] bg-[#078a76] text-white"
                                                                : "border-[#cedbd3] bg-white"
                                                        )}
                                                    >
                                                        {selected && <Check className="size-3" strokeWidth={3} />}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {errors.bisiType && (
                                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                                            <AlertCircle className="size-3 shrink-0" />
                                            {errors.bisiType}
                                        </p>
                                    )}
                                </section>

                                {/* ── Contribution & structure ── */}
                                <section className="space-y-4">
                                    <SectionHeading
                                        icon={<BadgeDollarSign className="size-4" />}
                                        title="Contribution & structure"
                                        hint="What each member pays and how big the group is"
                                    />

                                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3">
                                        <FormField label="Monthly Amount" required error={errors.monthlyAmount}>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#788b83]">
                                                    ₹
                                                </span>
                                                <Input
                                                    id="monthlyAmount"
                                                    type="number"
                                                    min={1}
                                                    placeholder="5000"
                                                    className={cn(inputClass(errors.monthlyAmount), "pl-8")}
                                                    value={form.monthlyAmount}
                                                    onChange={set("monthlyAmount")}
                                                    disabled={submitting}
                                                />
                                            </div>
                                        </FormField>

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

                                    {summary.pot !== "—" && (
                                        <div className="flex items-center gap-2.5 rounded-xl border border-[#c3e4ba]/70 bg-[#e2f1df]/50 px-4 py-2.5 text-sm text-[#164238]">
                                            <Wallet className="size-4 shrink-0 text-[#078a76]" />
                                            <span>
                                                Each cycle collects <span className="font-bold">{summary.pot}</span> —
                                                the payout a member receives on their turn.
                                            </span>
                                        </div>
                                    )}
                                </section>

                                {/* ── Schedule ── */}
                                <section className="space-y-4">
                                    <SectionHeading
                                        icon={<CalendarDays className="size-4" />}
                                        title="Schedule"
                                        hint="When the group starts and money is collected"
                                    />

                                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3">
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

                                        <FormField
                                            label="Collection Day"
                                            required
                                            error={errors.collectionDay}
                                            hint="Day of month (1–31)"
                                        >
                                            <Input
                                                id="collectionDay"
                                                type="number"
                                                min={1}
                                                max={31}
                                                placeholder="5"
                                                className={inputClass(errors.collectionDay)}
                                                value={form.collectionDay}
                                                onChange={set("collectionDay")}
                                                disabled={submitting}
                                            />
                                        </FormField>

                                        {/* Auction Day — only visible for Auction type */}
                                        {isAuction && (
                                            <FormField
                                                label="Auction Day"
                                                required
                                                error={errors.auctionDay}
                                                hint="Day of month (1–31)"
                                            >
                                                <Input
                                                    id="auctionDay"
                                                    type="number"
                                                    min={1}
                                                    max={31}
                                                    placeholder="10"
                                                    className={inputClass(errors.auctionDay)}
                                                    value={form.auctionDay}
                                                    onChange={set("auctionDay")}
                                                    disabled={submitting}
                                                />
                                            </FormField>
                                        )}
                                    </div>
                                </section>

                                {/* ── Late payment rules ── */}
                                <section className="space-y-4">
                                    <SectionHeading
                                        icon={<Clock className="size-4" />}
                                        title="Late payment rules"
                                        hint="Optional — leave blank for no penalty"
                                    />

                                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3">
                                        <FormField label="Late Fee" error={errors.lateFee}>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#788b83]">
                                                    ₹
                                                </span>
                                                <Input
                                                    id="lateFee"
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    className={cn(inputClass(errors.lateFee), "pl-8")}
                                                    value={form.lateFee}
                                                    onChange={set("lateFee")}
                                                    disabled={submitting}
                                                />
                                            </div>
                                        </FormField>

                                        <FormField label="Grace Period" error={errors.gracePeriod}>
                                            <div className="relative">
                                                <Input
                                                    id="gracePeriod"
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    className={cn(inputClass(errors.gracePeriod), "pr-14")}
                                                    value={form.gracePeriod}
                                                    onChange={set("gracePeriod")}
                                                    disabled={submitting}
                                                />
                                                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#94a39d]">
                                                    days
                                                </span>
                                            </div>
                                        </FormField>
                                    </div>
                                </section>

                                {/* Server error banner */}
                                {serverError && (
                                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
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
                            <DialogFooter className="m-0 shrink-0 flex-row items-center justify-between gap-3 rounded-none border-t border-[#e4ebe6] bg-[#f8faf8] px-6 py-4 sm:px-8">
                                <p className="hidden text-xs text-[#94a39d] sm:block">
                                    You can invite members after the group is created.
                                </p>
                                <div className="flex flex-1 items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClose(false)}
                                        disabled={submitting}
                                        className="h-11 cursor-pointer rounded-xl border-[#cedbd3] px-5 font-medium text-[#29463f] hover:bg-[#edf3ee]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting || success}
                                        className="h-11 cursor-pointer gap-2 rounded-xl bg-[#078a76] px-7 font-semibold text-white shadow-sm shadow-[#078a76]/25 transition-colors hover:bg-[#056c5c]"
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
                                </div>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
