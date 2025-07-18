import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertVehicleSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Plus, X } from "lucide-react";

const vehicleFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year must be 4 digits").transform(val => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1900 || num > new Date().getFullYear() + 1) {
      throw new Error("Invalid year");
    }
    return num;
  }),
  price: z.string().min(1, "Price is required").transform(val => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) throw new Error("Invalid price");
    return num.toString();
  }),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  kmDriven: z.string().min(1, "KM driven is required").transform(val => {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) throw new Error("Invalid KM driven");
    return num;
  }),
  location: z.string().min(1, "Location is required"),
  condition: z.string().min(1, "Condition is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  engineCapacity: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type VehicleFormData = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  vehicle?: any;
  onSuccess?: () => void;
}

export default function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + photos.length > 5) {
      toast({
        title: "Too many photos",
        description: "You can only upload up to 5 photos.",
        variant: "destructive",
      });
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    // Clean up URL object to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: vehicle?.brand || "",
      model: vehicle?.model || "",
      year: vehicle?.year?.toString() || "2024",
      price: vehicle?.price?.toString() || "",
      vehicleNumber: vehicle?.vehicleNumber || "",
      engineCapacity: vehicle?.engineCapacity || "",
      fuelType: vehicle?.fuelType || "petrol",
      kmDriven: vehicle?.kmDriven?.toString() || "0",
      location: vehicle?.location || "",
      description: vehicle?.description || "",
      condition: vehicle?.condition || "good",
      vehicleType: vehicle?.vehicleType || "motorcycle",
      isFeatured: vehicle?.isFeatured ?? false,
      isActive: vehicle?.isActive ?? true,
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: (data: VehicleFormData) => apiRequest("POST", "/api/vehicles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle created successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create vehicle. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: (data: VehicleFormData) => 
      apiRequest("PUT", `/api/vehicles/${vehicle.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Form valid:", form.formState.isValid);
    setIsSubmitting(true);
    try {
      // Convert photos to base64 strings
      const imageUrls: string[] = [];
      for (const photo of photos) {
        const base64 = await convertFileToBase64(photo);
        imageUrls.push(base64);
      }
      
      // Include images in the submission data
      const vehicleDataWithImages = {
        ...data,
        images: imageUrls.length > 0 ? imageUrls : undefined
      };
      
      if (vehicle) {
        console.log("Updating vehicle with ID:", vehicle.id);
        await updateVehicleMutation.mutateAsync(vehicleDataWithImages);
      } else {
        console.log("Creating new vehicle with images:", imageUrls.length);
        await createVehicleMutation.mutateAsync(vehicleDataWithImages);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-hema-secondary">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand *</FormLabel>
                  <FormControl>
                    <Input placeholder="Honda, Yamaha, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="CBR 650R, Aerox 155, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-hema-secondary">Technical Details</h3>
            
            <FormField
              control={form.control}
              name="engineCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="649cc, 155cc, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Engine displacement (e.g., 649cc)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kmDriven"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KM Driven *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pricing and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="425000" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the selling price in Indian Rupees
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai, Delhi, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Vehicle Number */}
        <FormField
          control={form.control}
          name="vehicleNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Number *</FormLabel>
              <FormControl>
                <Input placeholder="MH12AB1234" {...field} />
              </FormControl>
              <FormDescription>
                Enter the registration number of the vehicle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Vehicle Photos</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
          
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
          
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Vehicle photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <FormDescription>
            Add up to 5 photos of your vehicle. First photo will be used as the main image.
          </FormDescription>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the vehicle's features, condition, and any additional details..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description to help buyers understand your vehicle better
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Upload (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Vehicle Photos (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-hema-orange">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-6">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Vehicle</FormLabel>
                  <FormDescription>
                    Mark as featured to highlight this vehicle
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Listing</FormLabel>
                  <FormDescription>
                    Make this vehicle visible to buyers
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-hema-orange hover:bg-hema-orange/90"
          >
            {isSubmitting 
              ? (vehicle ? "Updating..." : "Creating...") 
              : (vehicle ? "Update Vehicle" : "Create Vehicle")
            }
          </Button>
          
          {onSuccess && (
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
