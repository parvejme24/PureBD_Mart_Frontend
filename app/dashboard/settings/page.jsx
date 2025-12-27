"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { Loader2, UploadCloud, RefreshCw, X } from "lucide-react";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const { mutateAsync: saveSettings, isPending } = useUpdateSettings();

  const [form, setForm] = useState({
    siteTitle: "",
    siteDescription: "",
    shippingInsideDhaka: "",
    shippingOutsideDhaka: "",
    freeDeliveryEnabled: false,
    freeDeliveryNote: "",
  });
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteFavicon, setSiteFavicon] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const existingLogo = settings?.siteLogo?.url;
  const existingFavicon = settings?.siteFavicon?.url;

  useEffect(() => {
    if (!settings) return;
    setForm({
      siteTitle: settings.siteTitle || "",
      siteDescription: settings.siteDescription || "",
      shippingInsideDhaka: settings.shippingInsideDhaka ?? "",
      shippingOutsideDhaka: settings.shippingOutsideDhaka ?? "",
      freeDeliveryEnabled: !!settings.freeDeliveryEnabled,
      freeDeliveryNote: settings.freeDeliveryNote || "",
    });
    setLogoPreview(settings.siteLogo?.url || null);
    setFaviconPreview(settings.siteFavicon?.url || null);
  }, [settings]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isIcoFile = (file) => {
    if (!file) return false;
    const name = file.name?.toLowerCase() || "";
    const type = file.type?.toLowerCase() || "";
    return name.endsWith(".ico") || type === "image/x-icon" || type === "image/vnd.microsoft.icon";
  };

  const handleFileChange = (e, setter, previewSetter, options = {}) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (options.requireIco && !isIcoFile(file)) {
      setUploadError("Favicon must be an .ico file.");
      setter(null);
      previewSetter(null);
      return;
    }

    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const disableSave = useMemo(() => {
    return (
      isPending ||
      isLoading ||
      !form.siteTitle ||
      Number(form.shippingInsideDhaka) < 0 ||
      Number(form.shippingOutsideDhaka) < 0
    );
  }, [
    form.siteTitle,
    form.shippingInsideDhaka,
    form.shippingOutsideDhaka,
    isPending,
    isLoading,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("siteTitle", form.siteTitle);
    fd.append("siteDescription", form.siteDescription);
    fd.append("shippingInsideDhaka", form.shippingInsideDhaka || 0);
    fd.append("shippingOutsideDhaka", form.shippingOutsideDhaka || 0);
    fd.append("freeDeliveryEnabled", form.freeDeliveryEnabled);
    fd.append("freeDeliveryNote", form.freeDeliveryNote);
    if (siteLogo) fd.append("siteLogo", siteLogo);
    if (siteFavicon) fd.append("siteFavicon", siteFavicon);
    await saveSettings(fd);
  };

  const clearLogo = () => {
    setUploadError("");
    setSiteLogo(null);
    setLogoPreview(null);
  };

  const clearFavicon = () => {
    setUploadError("");
    setSiteFavicon(null);
    setFaviconPreview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Store Settings</h1>
        <p className="text-sm text-gray-500">
          Update branding, shipping fees, and free delivery rules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Site title, description, and assets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={form.siteTitle}
                  onChange={(e) => handleChange("siteTitle", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={form.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  placeholder="Short tagline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <AssetUploader
                  id="siteLogo"
                  label="Site Logo"
                  preview={logoPreview}
                  onChange={(e) => handleFileChange(e, setSiteLogo, setLogoPreview)}
                helper="PNG/JPG/WEBP, recommended transparent"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                  onClear={clearLogo}
                  large
                />
              </div>
              <div>
                <AssetUploader
                  id="siteFavicon"
                  label="Site Favicon"
                  preview={faviconPreview}
                  onChange={(e) =>
                    handleFileChange(e, setSiteFavicon, setFaviconPreview, {
                      requireIco: true,
                    })
                  }
                  helper="ICO only, 64x64 recommended"
                  accept=".ico,image/x-icon"
                  onClear={clearFavicon}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Shipping & Delivery</CardTitle>
            <CardDescription>
              Control delivery fees and free delivery options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="shippingInsideDhaka">Inside Dhaka (৳)</Label>
                <Input
                  id="shippingInsideDhaka"
                  type="number"
                  min={0}
                  value={form.shippingInsideDhaka}
                  onChange={(e) => handleChange("shippingInsideDhaka", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shippingOutsideDhaka">Outside Dhaka (৳)</Label>
                <Input
                  id="shippingOutsideDhaka"
                  type="number"
                  min={0}
                  value={form.shippingOutsideDhaka}
                  onChange={(e) => handleChange("shippingOutsideDhaka", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border px-4 py-3 bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">Enable free delivery</p>
                <p className="text-sm text-gray-500">
                  Toggle to show a free delivery badge and note on the storefront.
                </p>
              </div>
              <Switch
                checked={form.freeDeliveryEnabled}
                onCheckedChange={(checked) =>
                  handleChange("freeDeliveryEnabled", checked)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="freeDeliveryNote">Free delivery note</Label>
              <Textarea
                id="freeDeliveryNote"
                placeholder="E.g., Free delivery on orders over ৳2000"
                value={form.freeDeliveryNote}
                onChange={(e) => handleChange("freeDeliveryNote", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={disableSave}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AssetUploader({ id, label, preview, onChange, helper, accept, onClear, large }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white cursor-pointer hover:border-[#3BB77E]"
        >
          <UploadCloud className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Upload</span>
        </label>
        <input id={id} type="file" className="hidden" onChange={onChange} accept={accept} />
        {preview && (
          <div
            className={`relative rounded-md overflow-hidden border bg-white ${
              large ? "h-20 w-32" : "h-12 w-12"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="h-full w-full object-contain" />
          </div>
        )}
      </div>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

